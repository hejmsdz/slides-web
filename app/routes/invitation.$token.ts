import { LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { joinTeam } from "~/api/teams";
import {
  requireSession,
  createAuthenticatedApi,
  commitSession,
} from "~/session";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);
  const { token } = params;
  invariant(token, "token is required");

  const team = await joinTeam(api, token);
  session.set("teamId", team.id);
  session.flash("toast", `Witaj w zespole ${team.name}`);

  return redirect(`/dashboard`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
