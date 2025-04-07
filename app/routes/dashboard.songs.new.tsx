import invariant from "tiny-invariant";
import SongForm from "~/components/songs/song-form";
import { postSong } from "~/api/songs";
import { redirect } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";

export default function NewSong() {
  return <SongForm />;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const title = formData.get("title")?.toString();
  invariant(title, "title is required");
  const subtitle = formData.get("subtitle")?.toString();
  const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
  invariant(lyrics, "lyrics are required");

  const { id } = await postSong({
    title,
    subtitle,
    lyrics,
    team: "d943b111-3621-41a9-ae26-d34c42eaaa1d",
  });

  return redirect(`/dashboard/songs/${id}`);
}
