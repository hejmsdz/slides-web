import { useState } from "react";
import { NavSongs } from "~/components/nav-songs";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/components/ui/sidebar";
import { Song } from "~/api/songs";
import { NewSongButton } from "./new-song-button";
import { SearchForm } from "./search-form";
import { Team } from "~/api/teams";

export function AppSidebar({
  songs,
  userName,
  isAdmin,
  teams,
  currentTeamId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  songs: Song[];
  userName: string;
  isAdmin: boolean;
  teams: Record<string, Team>;
  currentTeamId: string;
}) {
  const [query, setQuery] = useState<string>("");

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <NavUser
          userName={userName}
          teams={teams}
          currentTeamId={currentTeamId}
          isAdmin={isAdmin}
        />
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
