import { LoaderFunctionArgs, redirect } from "react-router";
import { getSongs } from "~/api/songs";
import { SiteHeader } from "~/components/site-header";
import { getSessionContext } from "~/context";

export default function DashboardIndex() {
  return (
    <SiteHeader>
      <h1>Strona główna</h1>
    </SiteHeader>
  );
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { session, api } = getSessionContext(context);

  const currentTeamId = session.get("teamId") ?? "";

  const { items: songs } = await getSongs(api, {
    teamId: currentTeamId,
    limit: 1,
    offset: 0,
  });

  if (songs.length > 0) {
    return redirect(`/dashboard/songs/${songs[0].id}`);
  }
}
