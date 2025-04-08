import { NavLink } from "@remix-run/react";
import { Song } from "~/api/songs";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Team } from "~/api/teams";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Copy, LockKeyhole } from "lucide-react";

export function NavSongs({
  items,
  teams,
}: {
  items: Song[];
  teams: Record<string, Team>;
}) {
  return (
    <>
      {/* <SidebarGroup className="px-0"> */}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <NavLink
                to={`/dashboard/songs/${item.id}`}
                className="max-w-full"
              >
                {({ isActive }) => (
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isActive}
                  >
                    <div className="flex justify-between">
                      <span className="block truncate">
                        {item.title}
                        {item.subtitle && ` / ${item.subtitle}`}
                      </span>
                      {item.teamId && (
                        <Tooltip>
                          <TooltipTrigger>
                            {item.isOverride ? (
                              <Copy width={16} height={16} />
                            ) : (
                              <LockKeyhole width={16} height={16} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {item.isOverride
                                ? "Własna wersja "
                                : "Prywatna pieśń "}{" "}
                              zespołu {teams[item.teamId].name}
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
