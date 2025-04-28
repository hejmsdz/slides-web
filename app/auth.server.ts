import { Google } from "arctic";
import { Session } from "react-router";
import { createAuthenticatedApi, updateSession } from "./session";
import invariant from "tiny-invariant";
import { AuthResponse } from "./api/auth";
import { getTeams } from "./api/teams";

invariant(process.env.AUTH_GOOGLE_ID, "AUTH_GOOGLE_ID is not set");
invariant(process.env.AUTH_GOOGLE_SECRET, "AUTH_GOOGLE_SECRET is not set");

export const google = new Google(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  new URL("auth/google/callback", process.env.FRONTEND_URL).toString(),
);

export const defaultRedirectUrl = "/dashboard";
export const getSafeRedirectUrl = (unsafeRedirectUrl?: string) => {
  invariant(process.env.FRONTEND_URL, "FRONTEND_URL is not set");

  if (!unsafeRedirectUrl) {
    return defaultRedirectUrl;
  }

  const redirectUrl = new URL(
    unsafeRedirectUrl,
    process.env.FRONTEND_URL,
  ).toString();
  if (redirectUrl.startsWith(process.env.FRONTEND_URL)) {
    return redirectUrl;
  }

  return defaultRedirectUrl;
};

export const authenticateUser = async (
  session: Session,
  authResponse: AuthResponse,
  { teamId, setToast = true }: { teamId?: string; setToast?: boolean } = {},
) => {
  updateSession(session, authResponse);

  const api = await createAuthenticatedApi(session);
  session.set("teamId", teamId ?? Object.keys(await getTeams(api))[0]);

  if (setToast) {
    session.flash("toast", `Cześć, ${authResponse.user.displayName}!`);
  }
};
