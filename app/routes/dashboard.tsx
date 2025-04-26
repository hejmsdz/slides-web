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
import { Toaster } from "~/components/ui/sonner";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { songs, userName, teams, currentTeamId, isAdmin, flashMessage } =
    useLoaderData<typeof loader>();

  useEffect(() => {
    if (flashMessage) {
      toast.info(flashMessage);
    }
  }, []);

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
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request);
  const api = await createAuthenticatedApi(session);

  const teams = await getTeams(api);

  const flashMessage = session.get("toast");
  const currentTeamId = session.get("teamId") ?? "";

  const songs = await getSongs(api, { teamId: currentTeamId });

  return Response.json(
    {
      songs,
      userName: session.get("name") ?? "Użytkownik",
      isAdmin: session.get("isAdmin") ?? false,
      teams,
      currentTeamId,
      flashMessage,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}
