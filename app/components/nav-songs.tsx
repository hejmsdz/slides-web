import type { RefObject } from "react";
import { NavLink } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Song } from "~/api/songs";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Copy, LockKeyhole, NotepadTextDashed } from "lucide-react";

export function NavSongs({
  songs,
  scrollRef,
}: {
  songs: { items: Song[]; total: number };
  scrollRef?: RefObject<HTMLElement>;
}) {
  const virtualizer = useVirtualizer({
    count: songs.total,
    getScrollElement: () => scrollRef?.current ?? null,
    estimateSize: () => 32,
    gap: 4,
  });

  return (
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu
        className="relative"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map(({ key, index, size, start }) => {
          const song = songs.items[index];

          return (
            <SidebarMenuItem
              key={key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: size,
                transform: `translateY(${start}px)`,
              }}
            >
              {song && (
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
                        {song.isUnofficial && (
                          <Tooltip>
                            <TooltipTrigger>
                              <NotepadTextDashed width={16} height={16} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nieoficjalna</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}
