import { Link } from "react-router";
import Form from "~/components/form";
import {
  LogOutIcon,
  MoreVerticalIcon,
  PlusIcon,
  Settings,
  UserRound,
  UserRoundCog,
  UsersRound,
  Smartphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import { NewTeamDialog } from "./new-team-dialog";
import useDashboardData from "~/hooks/use-dashboard-data";

export function NavUser() {
  const { userName, teams, currentTeamId, isAdmin, appDownloadUrl } =
    useDashboardData();

  const teamName = teams[currentTeamId]?.name ?? userName;
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
          <Form method="post">
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
                      formAction={`/dashboard/teams/${team.id}/switch`}
                    >
                      <UsersRound />
                      {team.name}
                    </button>
                  </DropdownMenuItem>
                ),
            )}
            <DropdownMenuSeparator />
          </Form>
        )}
        <NewTeamDialog>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <PlusIcon />
            Utwórz nowy zespół
          </DropdownMenuItem>
        </NewTeamDialog>
        {appDownloadUrl && (
          <a href={appDownloadUrl} target="_blank" rel="noopener noreferrer">
            <DropdownMenuItem>
              <Smartphone />
              Pobierz aplikację
            </DropdownMenuItem>
          </a>
        )}
        <Link to="/dashboard/settings">
          <DropdownMenuItem>
            <Settings />
            Ustawienia
          </DropdownMenuItem>
        </Link>
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
