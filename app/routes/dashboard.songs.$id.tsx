import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSong, patchSong, SongWithLyrics } from "~/api/songs";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import SongForm from "~/components/songs/song-form";
import {
  requireSession,
  createAuthenticatedApi,
  commitSession,
} from "~/session";
import { createAuthenticatedAction } from "~/routing.server";
import { getTeams } from "~/api/teams";

export default function Song() {
  const { song, teams, isAdmin, currentTeamId } =
    useLoaderData<typeof loader>();

  return (
    <SongForm
      key={song.id}
      song={song}
      teams={teams}
      isAdmin={isAdmin}
      currentTeamId={currentTeamId}
    />
  );
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

  const teams = await getTeams(api);

  return {
    song,
    teams,
    isAdmin: session.get("isAdmin") ?? false,
    currentTeamId: session.get("teamId") ?? Object.keys(teams)[0],
  };
}

export const action = createAuthenticatedAction(
  async ({ params, request }, { api, session }) => {
    invariant(params.id, "id is required");
    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    invariant(title, "title is required");
    const subtitle = formData.get("subtitle")?.toString();
    const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
    invariant(lyrics, "lyrics are required");

    const orNull = (value?: string) => (value && value !== "0" ? value : null);

    const teamId = orNull(formData.get("teamId")?.toString());
    const isOverride = formData.has("isOverride");

    if (teamId !== null && teamId !== "0" && teamId !== session.get("teamId")) {
      session.set("teamId", teamId);
    }

    const result = await patchSong(api, params.id, {
      title,
      subtitle,
      lyrics,
      teamId,
      isOverride,
    });

    if (isOverride) {
      return redirect(`/dashboard/songs/${result.id}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    return Response.json(true, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  },
);
