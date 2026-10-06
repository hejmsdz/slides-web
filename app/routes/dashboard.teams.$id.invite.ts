import invariant from "tiny-invariant";
import { ActionFunctionArgs } from "react-router";
import { inviteToTeam } from "~/api/teams";
import { getSessionContext } from "~/context";

export async function action({ params, context }: ActionFunctionArgs) {
  const { api } = getSessionContext(context);

  const teamId = params.id;
  invariant(teamId, "teamId is required");

  const invitation = await inviteToTeam(api, teamId);

  return invitation;
}
