import { LoaderFunctionArgs, redirect } from "react-router";
import { getSongs } from "~/api/songs";
import { SiteHeader } from "~/components/site-header";
import { createAuthenticatedApi, requireSession } from "~/session";

export default function DashboardIndex() {
  return (
    <SiteHeader>
      <h1>Strona główna</h1>
    </SiteHeader>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const currentTeamId = session.get("teamId") ?? "";

  const songs = await getSongs(api, { teamId: currentTeamId });

  if (songs.length > 0) {
    return redirect(`/dashboard/songs/${songs[0].id}`);
  }
}
