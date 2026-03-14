import { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { getSongs } from "~/api/songs";
import { createAuthenticatedApi, requireSession } from "~/session";

export const loader: LoaderFunction = (async ({ request }) => {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  invariant(query, "query is required");
  const teamId = session.get("teamId");
  invariant(teamId, "teamId is required");

  const songs = await getSongs(api, {
    query,
    teamId,
    limit: 1000,
    offset: 0,
  });

  return songs;
});
