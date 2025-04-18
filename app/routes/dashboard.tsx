import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getSongs } from "../api/songs";
import {
  commitSession,
  createAuthenticatedApi,
  requireSession,
} from "~/session";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { getTeams } from "~/api/teams";
import invariant from "tiny-invariant";

export default function Dashboard() {
  const { songs, userName, teams, currentTeamId, isAdmin } =
    useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        songs={songs}
        userName={userName}
        isAdmin={isAdmin}
        teams={teams}
        currentTeamId={currentTeamId}
      />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const teams = await getTeams(api);
  invariant(Object.keys(teams).length > 0, "No teams found");

  if (!session.has("teamId")) {
    session.set("teamId", Object.keys(teams)[0]);
  }

  const currentTeamId = session.get("teamId");

  const songs = await getSongs(api, { teamId: currentTeamId });

  return Response.json(
    {
      songs,
      userName: session.get("name") ?? "Użytkownik",
      isAdmin: session.get("isAdmin") ?? false,
      teams,
      currentTeamId,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}
