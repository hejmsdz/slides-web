import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSong, patchSong, SongWithLyrics } from "~/api/songs";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import SongForm from "~/components/songs/song-form";
import { requireSession, createAuthenticatedApi } from "~/session";
import { createAuthenticatedAction } from "~/routing.server";
import { getTeams } from "~/api/teams";

export default function Song() {
  const { song, teams } = useLoaderData<typeof loader>();

  return <SongForm song={song} teams={teams} />;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  let song: SongWithLyrics;
  try {
    song = await getSong(api, params.id);
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    song,
    teams: await getTeams(api),
  };
}

export const action = createAuthenticatedAction(
  async ({ params, request }, { api }) => {
    invariant(params.id, "id is required");
    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    invariant(title, "title is required");
    const subtitle = formData.get("subtitle")?.toString();
    const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
    invariant(lyrics, "lyrics are required");

    const orNull = (value?: string) => (value && value !== "0" ? value : null);

    const teamId = orNull(formData.get("teamId")?.toString());
    const prevTeamId = orNull(formData.get("prevTeamId")?.toString());
    const isOverride = teamId !== null && prevTeamId === null;

    const result = await patchSong(api, params.id, {
      title,
      subtitle,
      lyrics,
      teamId,
      isOverride,
    });

    if (isOverride) {
      return redirect(`/dashboard/songs/${result.id}`);
    }

    return null;
  },
);
