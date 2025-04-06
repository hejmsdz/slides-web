import { NavLink } from "@remix-run/react";
import { Song } from "~/api/songs";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export function NavSongs({ items }: { items: Song[] }) {
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
                    <div>
                      <span className="block truncate">
                        {item.title}
                        {item.subtitle && ` / ${item.subtitle}`}
                      </span>
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
