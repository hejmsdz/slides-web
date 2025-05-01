import {
  Outlet,
  useLoaderData,
  LoaderFunctionArgs,
  ClientLoaderFunctionArgs,
} from "react-router";
import { getSongs } from "../api/songs";
import { createAuthenticatedApi, requireSessionWithRefresh } from "~/session";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { getTeams } from "~/api/teams";
import { Toaster } from "~/components/ui/sonner";
import * as cache from "~/cache.client";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const useFlashMessage = () => {
  const { flashMessage } = useLoaderData<typeof loader>();
  const displayedMessageRef = useRef<string | null>(null);
  useEffect(() => {
    if (flashMessage && flashMessage !== displayedMessageRef.current) {
      toast.info(flashMessage);
      displayedMessageRef.current = flashMessage;
    }
  }, [flashMessage]);
};

export default function Dashboard() {
  const { songs, userName, teams, currentTeamId, isAdmin } =
    useLoaderData<typeof loader>();

  useFlashMessage();
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
  const session = await requireSessionWithRefresh(request);
  const api = await createAuthenticatedApi(session);

  const teams = await getTeams(api);

  const flashMessage = session.get("toast");
  const currentTeamId = session.get("teamId") ?? "";

  const songs = await getSongs(api, { teamId: currentTeamId });

  const isWebView = request.headers
    .get("User-Agent")
    ?.includes("PsalltWebView");

  return {
    songs,
    userName: session.get("name") ?? "Użytkownik",
    isAdmin: session.get("isAdmin") ?? false,
    teams,
    currentTeamId,
    flashMessage,
    isWebView,
  };
}

export type ServerData = Awaited<ReturnType<typeof loader>>;

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  if (cache.exists()) {
    return cache.get();
  }

  const serverData = await serverLoader<typeof loader>();
  cache.set(serverData);

  return serverData;
}

clientLoader.hydrate = true;
