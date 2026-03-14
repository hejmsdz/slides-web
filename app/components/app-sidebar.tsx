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
import usePaginatedSongs from "~/hooks/use-paginated-songs";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { songs: defaultSongs, currentTeamId } = useDashboardData();
  const contentRef = useRef<HTMLDivElement>(null);
  const { songs, total, handleQueryChange, handleNeedItems } =
    usePaginatedSongs(defaultSongs);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <NavUser />
        <SearchForm onQueryChange={handleQueryChange} />
      </SidebarHeader>
      <SidebarContent ref={contentRef}>
        <NavSongs
          songs={songs}
          totalSongs={total}
          scrollRef={contentRef}
          onNeedItems={handleNeedItems}
        />
      </SidebarContent>
      {currentTeamId && (
        <SidebarFooter className="px-0">
          <NewSongButton />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
