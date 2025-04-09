import { Form } from "@remix-run/react";
import {
  LogOutIcon,
  MoreVerticalIcon,
  UserRound,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import { Team } from "~/api/teams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton } from "~/components/ui/sidebar";

export function NavUser({
  userName,
  teams,
  currentTeamId,
  isAdmin,
}: {
  userName: string;
  teams: Record<string, Team>;
  currentTeamId: string;
  isAdmin: boolean;
}) {
  const teamName = teams[currentTeamId].name;
  const teamsList = Object.values(teams);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 flex flex-row h-auto">
          <div className="flex flex-col items-start gap-1">
            <div className="text-base font-semibold truncate">{teamName}</div>
            <div className="text-left text-sm leading-tight">
              <span className="truncate text-xs text-muted-foreground flex gap-1">
                {isAdmin ? (
                  <UserRoundCog className="h-4 w-4" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
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
        {teamsList.length > 1 && (
          <Form method="post" action="/dashboard/teams/switch">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Twoje zespoły
            </DropdownMenuLabel>
            {teamsList.map(
              (team) =>
                team.id !== currentTeamId && (
                  <DropdownMenuItem key={team.id} asChild>
                    <button
                      type="submit"
                      className="w-full"
                      name="teamId"
                      value={team.id}
                    >
                      <UsersRound />
                      {team.name}
                    </button>
                  </DropdownMenuItem>
                ),
            )}
          </Form>
        )}
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <UserRoundCog />
          Ustawienia
        </DropdownMenuItem> */}
        <Form method="post" action="/auth/logout">
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOutIcon />
              Wyloguj
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
