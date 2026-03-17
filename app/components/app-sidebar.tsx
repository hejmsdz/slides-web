import { useState, useCallback } from "react";
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
import useDebouncedValue from "~/hooks/use-debounced-value";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { songs: defaultSongs, currentTeamId } = useDashboardData();
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  );

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const { songs, total, onNeedItems } = usePaginatedSongs(
    defaultSongs,
    debouncedQuery,
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <NavUser />
        <SearchForm query={query} onQueryChange={setQuery} />
      </SidebarHeader>
      <SidebarContent ref={setScrollElement}>
        <NavSongs
          songs={songs}
          totalSongs={total}
          scrollElement={scrollElement}
          onNeedItems={onNeedItems}
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
