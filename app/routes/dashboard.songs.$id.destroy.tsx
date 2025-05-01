import { destroySong, getSong, SongWithLyrics } from "~/api/songs";
import invariant from "tiny-invariant";
import { ClientActionFunctionArgs, redirect } from "react-router";
import { createAuthenticatedAction } from "~/routing.server";
import * as cache from "~/cache.client";

export const action = createAuthenticatedAction(async ({ params }, { api }) => {
  invariant(params.id, "id is required");

  let song: SongWithLyrics;
  try {
    song = await getSong(api, params.id);
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }

  await destroySong(api, params.id);

  if (song.isOverride) {
    return redirect(`/dashboard/songs/${song.overriddenSongId}`);
  }

  return redirect("/dashboard");
});

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const result = await serverAction();
  cache.clear();

  return result;
}
