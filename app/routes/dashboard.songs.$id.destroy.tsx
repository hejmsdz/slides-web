import { destroySong, getSong, SongWithLyrics } from "~/api/songs";
import invariant from "tiny-invariant";
import { redirect } from "@remix-run/react";
import { createAuthenticatedAction } from "~/routing.server";

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
