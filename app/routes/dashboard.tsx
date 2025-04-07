import { Outlet, useLoaderData } from "@remix-run/react";
import { getSongs } from "../api/songs";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function Dashboard() {
  const { songs } = useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" songs={songs} />
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

export async function loader() {
  const songs = await getSongs();
  return { songs };
}
