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

export const requireSessionWithRefresh = async (
  request: Request,
  headers: Headers = new Headers(),
): Promise<Session> => {
  const session = await requireSession(request);

  const accessTokenExpiresAt = session.get("accessTokenExpiresAt");
  if (accessTokenExpiresAt && accessTokenExpiresAt < Date.now() / 1000) {
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

    headers.set("Set-Cookie", await commitSession(session));

    if (request.method === "GET") {
      throw redirect(request.url, {
        headers,
      });
    }
  }

  return session;
};

export const createAuthenticatedApi = async (session: Session) => {
  const accessToken = session.get("accessToken");
  invariant(accessToken, "access token is required");

  return new Api(session.get("accessToken"));
};
