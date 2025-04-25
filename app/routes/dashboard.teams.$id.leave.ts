import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getTeams, leaveTeam } from "~/api/teams";
import { createAuthenticatedAction } from "~/routing.server";
import { commitSession } from "~/session";

export const action = createAuthenticatedAction(
  async ({ params }, { api, session }) => {
    const teamId = params.id;
    invariant(teamId, "teamId is required");

    await leaveTeam(api, teamId);

    const teams = await getTeams(api);

    session.set("teamId", Object.keys(teams)[0]);
    return redirect(`/dashboard/settings`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  },
);
