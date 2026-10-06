import { redirect, ActionFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { getTeams } from "~/api/teams";
import { getSessionContext } from "~/context";
import { commitSession } from "~/session";

export async function action({ params, context }: ActionFunctionArgs) {
  const { api, session } = getSessionContext(context);

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
}
