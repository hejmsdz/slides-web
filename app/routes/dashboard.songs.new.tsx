import invariant from "tiny-invariant";
import SongForm from "~/components/songs/song-form";
import { postSong } from "~/api/songs";
import { redirect, MetaFunction } from "react-router";
import { createAuthenticatedAction } from "~/routing.server";
import { commitSession } from "~/session";

export const meta: MetaFunction = () => {
  return [{ title: "Nowa pieśń" }];
};

export default function NewSong() {
  return (
    <SongForm
      key="new"
      autoFocus // eslint-disable-line jsx-a11y/no-autofocus
    />
  );
}

export const action = createAuthenticatedAction(
  async ({ request }, { api, session }) => {
    const formData = await request.formData();

    const title = formData.get("title")?.toString();
    invariant(title, "title is required");
    const subtitle = formData.get("subtitle")?.toString();
    const lyrics = formData.get("lyrics")?.toString()?.split("\n\n");
    invariant(lyrics, "lyrics are required");

    const orUndefined = (value?: string) =>
      value && value !== "0" && value !== "unofficial" ? value : undefined;

    const teamId = orUndefined(formData.get("teamId")?.toString());
    const isUnofficial = formData.get("teamId")?.toString() === "unofficial";

    if (
      teamId !== undefined &&
      teamId !== "0" &&
      teamId !== "unofficial" &&
      teamId !== session.get("teamId")
    ) {
      session.set("teamId", teamId);
    }

    const { id } = await postSong(api, {
      title,
      subtitle,
      lyrics,
      teamId,
      isUnofficial,
    });

    return redirect(`/dashboard/songs/${id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  },
);
