import { useRef } from "react";
import { NavSongs } from "~/components/nav-songs";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/components/ui/sidebar";
import { NewSongButton } from "./new-song-button";
import { SearchForm } from "./search-form";
import useDashboardData from "~/hooks/use-dashboard-data";
import { useFetcher } from "react-router";
import type { loader } from "~/routes/dashboard.songs.search";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { songs: defaultSongs, currentTeamId } = useDashboardData();

  const contentRef = useRef<HTMLDivElement>(null);
  const fetcher = useFetcher<typeof loader>();
  const songs = fetcher.data ?? defaultSongs;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <NavUser />
        <SearchForm fetcher={fetcher} />
      </SidebarHeader>
      <SidebarContent ref={contentRef}>
        <NavSongs songs={songs} scrollRef={contentRef} />
      </SidebarContent>
      {currentTeamId && (
        <SidebarFooter className="px-0">
          <NewSongButton />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
