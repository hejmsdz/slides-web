import { LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton } from "~/components/ui/sidebar";

export function NavUser({
  userName,
  teamName,
}: {
  userName: string;
  teamName: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 flex flex-row h-auto">
          <div className="flex flex-col items-start gap-1">
            <div className="text-base font-semibold truncate">{teamName}</div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate text-xs text-muted-foreground flex gap-1">
                <UserCircleIcon className="h-4 w-4" />
                {userName}
              </span>
            </div>
          </div>
          <MoreVerticalIcon className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
      >
        {/* <DropdownMenuItem>
              <UserCircleIcon />
              Ustawienia
            </DropdownMenuItem> */}
        <DropdownMenuItem>
          <LogOutIcon />
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
