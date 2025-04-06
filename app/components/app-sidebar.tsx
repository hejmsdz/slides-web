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

export function AppSidebar({
  songs,
  ...props
}: React.ComponentProps<typeof Sidebar> & { songs: Song[] }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-0">
        <NavUser
          userName="Mikołaj Rozwadowski"
          teamName="Zebrani w dnia połowie"
        />
        <SearchForm value={""} onChange={() => {}} />
      </SidebarHeader>
      <SidebarContent>
        <NavSongs items={songs} />
      </SidebarContent>
      <SidebarFooter className="px-0">
        <NewSongButton />
      </SidebarFooter>
    </Sidebar>
  );
}
