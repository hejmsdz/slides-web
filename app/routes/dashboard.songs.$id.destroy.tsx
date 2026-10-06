import { destroySong, getSong, SongWithLyrics } from "~/api/songs";
import invariant from "tiny-invariant";
import { redirect, ActionFunctionArgs } from "react-router";
import { getSessionContext } from "~/context";

export async function action({ params, context }: ActionFunctionArgs) {
  const { api } = getSessionContext(context);

  invariant(params.id, "id is required");

  let song: SongWithLyrics;
  try {
    song = await getSong(api, params.id);
  } catch {
    throw new Response("Not Found", { status: 404 });
  }

  await destroySong(api, params.id);

  if (song.isOverride) {
    return redirect(`/dashboard/songs/${song.overriddenSongId}`);
  }

  return redirect("/dashboard");
}
