import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTeams } from "~/api/teams";
import { createAuthenticatedAction } from "~/routing.server";
import { commitSession } from "~/session";

export const action = createAuthenticatedAction(
  async ({ params }, { api, session }) => {
    const teamId = params.id;
    invariant(teamId, "teamId is required");

    const teams = await getTeams(api);
    const team = teams[teamId];
    invariant(team, "team not found");

    session.set("teamId", teamId);
    return redirect(`/dashboard`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  },
);
