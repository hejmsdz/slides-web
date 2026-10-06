import { redirect, ActionFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { getTeams, leaveTeam } from "~/api/teams";
import { getSessionContext } from "~/context";
import { commitSession } from "~/session";

export async function action({ params, context }: ActionFunctionArgs) {
  const { api, session } = getSessionContext(context);

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
}
