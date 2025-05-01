import { useState } from "react";
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

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { songs, currentTeamId } = useDashboardData();

  const [query, setQuery] = useState<string>("");

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <NavUser />
        <SearchForm
          value={query}
          onChange={(value) => {
            setQuery(value);
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavSongs songs={songs} query={query} />
      </SidebarContent>
      {currentTeamId && (
        <SidebarFooter className="px-0">
          <NewSongButton />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
