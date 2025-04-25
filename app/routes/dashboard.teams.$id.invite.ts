import invariant from "tiny-invariant";
import { inviteToTeam } from "~/api/teams";
import { createAuthenticatedAction } from "~/routing.server";

export const action = createAuthenticatedAction(async ({ params }, { api }) => {
  const teamId = params.id;
  invariant(teamId, "teamId is required");

  const invitation = await inviteToTeam(api, teamId);

  return invitation;
});
