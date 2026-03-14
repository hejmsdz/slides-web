import { LoaderFunction } from "react-router";
import invariant from "tiny-invariant";
import { getSongs } from "~/api/songs";
import { createAuthenticatedApi, requireSession } from "~/session";

export const PAGE_SIZE = 30;

export const loader: LoaderFunction = (async ({ request }) => {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? undefined;
  const offset = Number(searchParams.get("offset"));

  const teamId = session.get("teamId");
  invariant(teamId, "teamId is required");

  const songs = await getSongs(api, {
    query,
    teamId,
    limit: PAGE_SIZE,
    offset,
  });

  return songs;
});
