import { Cookie, LoaderFunctionArgs, redirect } from "react-router";
import { OAuth2Tokens } from "arctic";
import { defaultApi } from "~/api/api";
import { postGoogleAuth, AuthResponse } from "~/api/auth";
import { authenticateUser, getSafeRedirectUrl, google } from "~/auth.server";
import * as cookies from "~/cookies.server";
import { commitSession, getSession } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieHeader = request.headers.get("Cookie");
  const storedState = await cookies.googleOAuthState.parse(cookieHeader);
  const codeVerifier = await cookies.googleCodeVerifier.parse(cookieHeader);
  const redirectUrl = getSafeRedirectUrl(
    await cookies.redirectUrl.parse(cookieHeader),
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
      status: 401,
    });
  }

  let authResponse: AuthResponse;
  try {
    authResponse = await postGoogleAuth(defaultApi, tokens.idToken());
  } catch (e) {
    return new Response(null, {
      status: 401,
    });
  }

  const session = await getSession(cookieHeader);

  await authenticateUser(session, authResponse);

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
