import invariant from "tiny-invariant";
import SongForm from "~/components/songs/song-form";
import { postSong } from "~/api/songs";
import { redirect, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { createAuthenticatedAction } from "~/routing.server";
import { getTeams } from "~/api/teams";
import {
  requireSession,
  createAuthenticatedApi,
  commitSession,
} from "~/session";

export default function NewSong() {
  const { teams, isAdmin, currentTeamId } = useLoaderData<typeof loader>();
  return (
    <SongForm
      key="new"
      teams={teams}
      isAdmin={isAdmin}
      currentTeamId={currentTeamId}
    />
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  return {
    teams: await getTeams(api),
    isAdmin: session.get("isAdmin") ?? false,
    currentTeamId: session.get("teamId") ?? "0",
  };
}

export const action = createAuthenticatedAction(
  async ({ request }, { api, session }) => {
    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    invariant(title, "title is required");
    const subtitle = formData.get("subtitle")?.toString();
    const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
    invariant(lyrics, "lyrics are required");
    const orNull = (value?: string) => (value && value !== "0" ? value : null);

    const teamId = orNull(formData.get("teamId")?.toString());

    if (teamId !== null && teamId !== "0" && teamId !== session.get("teamId")) {
      session.set("teamId", teamId);
    }

    const { id } = await postSong(api, {
      title,
      subtitle,
      lyrics,
      teamId,
    });

    return redirect(`/dashboard/songs/${id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  },
);
