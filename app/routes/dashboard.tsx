import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getSongs } from "../api/songs";
import { createAuthenticatedApi, requireSession } from "~/session";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { getTeams } from "~/api/teams";

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
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const songs = await getSongs(api);
  const teams = await getTeams(api);
  const currentTeamId = session.get("teamId") || Object.keys(teams)[0];

  return {
    songs,
    userName: session.get("name") ?? "Użytkownik",
    isAdmin: session.get("isAdmin") ?? false,
    teams,
    currentTeamId,
  };
}
