import { redirect, LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { AuthResponse, postAuthNonceVerify } from "~/api/auth";
import { authenticateUser, getSafeRedirectUrl } from "~/auth.server";
import { defaultApi } from "~/api/api";
import { commitSession, getSession } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const nonce = url.searchParams.get("nonce");
  const teamId = url.searchParams.get("teamId") ?? undefined;
  const redirectUrl = getSafeRedirectUrl(
    url.searchParams.get("redirect") ?? undefined,
  );

  invariant(nonce, "Nonce is required");

  let authResponse: AuthResponse;
  try {
    authResponse = await postAuthNonceVerify(defaultApi, nonce);
  } catch (e) {
    return new Response(null, {
      status: 401,
    });
  }

  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  await authenticateUser(session, authResponse, {
    teamId,
    setToast: false,
  });

  return redirect(redirectUrl, {
    headers: [["Set-Cookie", await commitSession(session)]],
  });
}
