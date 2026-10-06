import invariant from "tiny-invariant";
import { getSongs } from "~/api/songs";
import { getSessionContext } from "~/context";
import type { Route } from "./+types/dashboard.songs.search";

export const PAGE_SIZE = 30;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const { session, api } = getSessionContext(context);

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
