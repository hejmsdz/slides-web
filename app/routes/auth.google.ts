import { LoaderFunctionArgs, redirect } from "react-router";
import { generateCodeVerifier, generateState } from "arctic";
import { google } from "~/auth.server";
import * as cookies from "~/cookies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);
  const redirectAfterLogin = new URL(request.url).searchParams.get("redirect");

  return redirect(url.toString(), {
    headers: [
      ["Set-Cookie", await cookies.googleOAuthState.serialize(state)],
      ["Set-Cookie", await cookies.googleCodeVerifier.serialize(codeVerifier)],
      ["Set-Cookie", await cookies.redirectUrl.serialize(redirectAfterLogin)],
    ],
  });
}
