import { ApiType as Api } from "./api";

export type Team = {
  id: string;
  name: string;
};

export const getTeams = async (api: Api): Promise<Record<string, Team>> => {
  const teams = await api.get("v2/teams");

  return teams.reduce((acc: Record<string, Team>, team: Team) => {
    acc[team.id] = team;

    return acc;
  }, {});
};
