import invariant from "tiny-invariant";
import { getSongs } from "~/api/songs";
import { createAuthenticatedApi, requireSessionWithRefresh } from "~/session";
import type { Route } from "./+types/dashboard.songs.search";

export const PAGE_SIZE = 30;

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await requireSessionWithRefresh(request);
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
};
