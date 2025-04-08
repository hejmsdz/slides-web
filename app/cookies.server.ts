import { CookieSerializeOptions, createCookie } from "@remix-run/node"; // or cloudflare/deno

const cookieOptions: CookieSerializeOptions = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 10,
  sameSite: "lax",
};

export const googleOAuthState = createCookie(
  "google_oauth_state",
  cookieOptions,
);

export const googleCodeVerifier = createCookie(
  "google_code_verifier",
  cookieOptions,
);

export const redirectUrl = createCookie("redirect_url", cookieOptions);
