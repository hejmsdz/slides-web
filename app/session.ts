import { createCookieSessionStorage, redirect } from "react-router";
import jwt from "jsonwebtoken";
import { AuthResponse, postRefreshToken } from "./api/auth";
import Api, { defaultApi } from "./api/api";
import invariant from "tiny-invariant";

type SessionData = {
  accessToken: string;
  refreshToken: string;
  name: string;
  isAdmin: boolean;
  accessTokenExpiresAt: number;
  teamId: string;
};

type SessionFlashData = {
  toast: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET!],
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };

export type Session = Awaited<ReturnType<typeof getSession>>;

export const updateSession = (session: Session, authResponse: AuthResponse) => {
  session.set("accessToken", authResponse.token);
  session.set("refreshToken", authResponse.refreshToken);
  session.set("name", authResponse.user.displayName);

  const decoded = jwt.decode(authResponse.token);
  if (typeof decoded === "object") {
    const expiresAt = decoded?.exp ? decoded.exp : -1;
    session.set("accessTokenExpiresAt", expiresAt);
    session.set("isAdmin", decoded?.admin ?? false);
  }
};

export const logOut = async (session: Session) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const requireSession = async (request: Request): Promise<Session> => {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("accessToken");
  if (!accessToken) {
    throw redirect(
      `/auth/google?${new URLSearchParams({
        redirect: request.url,
      })}`,
    );
  }

  return session;
};

const minAccessTokenRemainingSeconds = 30;

export const requireSessionWithRefresh = async (
  request: Request,
): Promise<{ session: Session; cookieToSet?: string }> => {
  const session = await requireSession(request);
  let cookieToSet: string | undefined;

  const accessTokenExpiresAt = session.get("accessTokenExpiresAt") ?? 0;
  const accessTokenExpiresIn = accessTokenExpiresAt - Date.now() / 1000;
  if (accessTokenExpiresIn < minAccessTokenRemainingSeconds) {
    const refreshToken = session.get("refreshToken");
    if (!refreshToken) {
      throw await logOut(session);
    }

    try {
      const authResponse = await postRefreshToken(defaultApi, refreshToken);
      updateSession(session, authResponse);
    } catch (error) {
      console.error(error);
      throw await logOut(session);
    }

    cookieToSet = await commitSession(session);
  }

  return { session, cookieToSet };
};

export const createAuthenticatedApi = (session: Session): Api => {
  const accessToken = session.get("accessToken");
  invariant(accessToken, "access token is required");

  return new Api(session.get("accessToken"));
};
