import {
  Outlet,
  useLoaderData,
  LoaderFunctionArgs,
  ClientLoaderFunctionArgs,
} from "react-router";
import { getSongs, Song } from "../api/songs";
import {
  commitSession,
  createAuthenticatedApi,
  requireSessionWithRefresh,
} from "~/session";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { getTeams, Team } from "~/api/teams";
import { Toaster } from "~/components/ui/sonner";
import * as cache from "~/cache.client";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { getBootstrap } from "~/api/bootstrap";

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
  useFlashMessage();
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}

export type ServerData = {
  songs: Song[];
  userName: string;
  teams: Record<string, Team>;
  currentTeamId: string;
  isAdmin: boolean;
  flashMessage?: string;
  isWebView: boolean;
  accessTokenExpiresAt?: number;
  apiUrl: string;
  appDownloadUrl: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireSessionWithRefresh(request);
  const api = await createAuthenticatedApi(session);

  const bootstrap = await getBootstrap(api);

  const teams = await getTeams(api);

  const flashMessage = session.get("toast");
  const currentTeamId = session.get("teamId") ?? "";

  const songs = await getSongs(api, { teamId: currentTeamId });

  const isWebView =
    request.headers.get("User-Agent")?.includes("PsalltWebView") ?? false;

  invariant(process.env.EXTERNAL_API_URL, "EXTERNAL_API_URL is not set");

  return Response.json(
    {
      songs,
      userName: session.get("name") ?? "Użytkownik",
      isAdmin: session.get("isAdmin") ?? false,
      teams,
      currentTeamId,
      flashMessage,
      isWebView,
      accessTokenExpiresAt: session.get("accessTokenExpiresAt"),
      apiUrl: process.env.EXTERNAL_API_URL,
      appDownloadUrl: bootstrap.appDownloadUrl,
    } satisfies ServerData,
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const cachedData = cache.get();
  if (cachedData !== null) {
    const shouldRefresh =
      cachedData.accessTokenExpiresAt &&
      cachedData.accessTokenExpiresAt < Date.now() / 1000;

    if (!shouldRefresh) {
      return cachedData;
    }
  }

  const serverData = await serverLoader<typeof loader>();
  cache.set(serverData);

  return serverData;
}

clientLoader.hydrate = true;
