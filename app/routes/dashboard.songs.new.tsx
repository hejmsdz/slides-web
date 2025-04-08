import invariant from "tiny-invariant";
import SongForm from "~/components/songs/song-form";
import { postSong } from "~/api/songs";
import { redirect, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createAuthenticatedAction } from "~/routing.server";
import { getTeams } from "~/api/teams";
import { requireSession, createAuthenticatedApi } from "~/session";

export default function NewSong() {
  const { teams } = useLoaderData<typeof loader>();
  return <SongForm teams={teams} />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  return { teams: await getTeams(api) };
}

export const action = createAuthenticatedAction(
  async ({ request }: ActionFunctionArgs, { api }) => {
    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    invariant(title, "title is required");
    const subtitle = formData.get("subtitle")?.toString();
    const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
    invariant(lyrics, "lyrics are required");
    const orNull = (value?: string) => (value && value !== "0" ? value : null);

    const teamId = orNull(formData.get("teamId")?.toString());

    const { id } = await postSong(api, {
      title,
      subtitle,
      lyrics,
      teamId,
    });

    return redirect(`/dashboard/songs/${id}`);
  },
);
