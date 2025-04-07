import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getSong, patchSong } from "~/api/songs";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import SongForm from "~/components/songs/song-form";

export default function Song() {
  const { song } = useLoaderData<typeof loader>();

  return <SongForm song={song} />;
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const song = await getSong(params.id);
    return { song };
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id")?.toString();
  invariant(id, "id is required");

  const title = formData.get("title")?.toString();
  invariant(title, "title is required");
  const subtitle = formData.get("subtitle")?.toString();
  const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
  invariant(lyrics, "lyrics are required");

  await patchSong(id, { title, subtitle, lyrics });

  return true;
}
