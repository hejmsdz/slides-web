import { Cookie, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { OAuth2Tokens } from "arctic";
import invariant from "tiny-invariant";
import { defaultApi } from "~/api/api";
import { postGoogleAuth, AuthResponse } from "~/api/auth";
import { getTeams } from "~/api/teams";
import { google } from "~/auth.server";
import * as cookies from "~/cookies.server";
import {
  commitSession,
  createAuthenticatedApi,
  getSession,
  updateSession,
} from "~/session";

const defaultRedirectUrl = "/dashboard";
const getSafeRedirectUrl = (unsafeRedirectUrl: string) => {
  invariant(process.env.FRONTEND_URL, "FRONTEND_URL is not set");

  const redirectUrl = new URL(
    unsafeRedirectUrl,
    process.env.FRONTEND_URL,
  ).toString();
  if (redirectUrl.startsWith(process.env.FRONTEND_URL)) {
    return redirectUrl;
  }

  return defaultRedirectUrl;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieHeader = request.headers.get("Cookie");
  const storedState = await cookies.googleOAuthState.parse(cookieHeader);
  const codeVerifier = await cookies.googleCodeVerifier.parse(cookieHeader);
  const redirectUrl = getSafeRedirectUrl(
    (await cookies.redirectUrl.parse(cookieHeader)) ?? defaultRedirectUrl,
  );

  if (!code || !state || !storedState || !codeVerifier) {
    return new Response(null, {
      status: 400,
    });
  }

  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (e) {
    console.error("error validating authorization code", e);
    return new Response(null, {
      status: 400,
    });
  }

  let authResponse: AuthResponse;
  try {
    authResponse = await postGoogleAuth(defaultApi, tokens.idToken());
  } catch (e) {
    console.error("error posting google auth", e);
    return new Response(null, {
      status: 400,
    });
  }

  const session = await getSession(cookieHeader);
  updateSession(session, authResponse);

  const api = await createAuthenticatedApi(session);
  const teams = await getTeams(api);
  session.set("teamId", Object.keys(teams)[0]);

  const deleteCookie = async (cookie: Cookie) => {
    return await cookie.serialize(null, { maxAge: -1 });
  };

  return redirect(redirectUrl, {
    headers: [
      ["Set-Cookie", await commitSession(session)],
      ["Set-Cookie", await deleteCookie(cookies.googleOAuthState)],
      ["Set-Cookie", await deleteCookie(cookies.googleCodeVerifier)],
      ["Set-Cookie", await deleteCookie(cookies.redirectUrl)],
    ],
  });
}
