import {
  ClientActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  useLoaderData,
} from "react-router";
import { getSong, patchSong, SongWithLyrics } from "~/api/songs";
import invariant from "tiny-invariant";
import SongForm from "~/components/songs/song-form";
import {
  requireSession,
  createAuthenticatedApi,
  commitSession,
} from "~/session";
import { createAuthenticatedAction } from "~/routing.server";
import * as cache from "~/cache.client";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: data?.song
        ? `${data.song.title}${data.song.subtitle ? ` / ${data.song.subtitle}` : ""}`
        : "Edytuj pieśń",
    },
  ];
};

export default function Song() {
  const { song } = useLoaderData<typeof loader>();

  return <SongForm key={song.id} song={song} />;
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

    const orUndefined = (value?: string) =>
      value && value !== "0" ? value : undefined;

    const teamId = orUndefined(formData.get("teamId")?.toString());
    const isOverride = formData.has("isOverride");

    if (
      teamId !== undefined &&
      teamId !== "0" &&
      teamId !== session.get("teamId")
    ) {
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

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const result = await serverAction();
  cache.clear();

  return result;
}
