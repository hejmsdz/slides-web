import { useMemo } from "react";
import { NavLink } from "@remix-run/react";
import { Song } from "~/api/songs";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Copy, LockKeyhole } from "lucide-react";

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replaceAll("ą", "a")
    .replaceAll("ć", "c")
    .replaceAll("ę", "e")
    .replaceAll("ł", "l")
    .replaceAll("ń", "n")
    .replaceAll("ó", "o")
    .replaceAll("ś", "s")
    .replaceAll("ź", "z")
    .replaceAll("ż", "z");

export function NavSongs({ songs, query }: { songs: Song[]; query: string }) {
  const filteredSongs = useMemo(() => {
    const searchSlug = slugify(query);

    return songs.filter((song) => song.slug.includes(searchSlug));
  }, [songs, query]);

  return (
    <>
      {/* <SidebarGroup className="px-0"> */}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {filteredSongs.map((song) => (
            <SidebarMenuItem key={song.id}>
              <NavLink
                to={`/dashboard/songs/${song.id}`}
                className="max-w-full"
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={song.title}
                    asChild
                    isActive={isActive}
                  >
                    <div className="flex justify-between">
                      <span className="block truncate">
                        {song.title}
                        {song.subtitle && ` / ${song.subtitle}`}
                      </span>
                      {song.teamId && (
                        <Tooltip>
                          <TooltipTrigger>
                            {song.isOverride ? (
                              <Copy width={16} height={16} />
                            ) : (
                              <LockKeyhole width={16} height={16} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {song.isOverride
                                ? "Własna wersja pieśni"
                                : "Prywatna pieśń"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      {/* </SidebarGroup> */}
    </>
  );
}
