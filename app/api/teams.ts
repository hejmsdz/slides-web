import { ApiType as Api } from "./api";

export type Team = {
  id: string;
  name: string;
};

export type TeamMember = {
  id: string;
  name: string;
};

export type TeamDetails = Team & {
  members: TeamMember[];
};

export type TeamInvitation = {
  url: string;
  expiresAt: string;
};

export const getTeams = async (api: Api): Promise<Record<string, Team>> => {
  const teams = await api.get("v2/teams");

  return teams.reduce((acc: Record<string, Team>, team: Team) => {
    acc[team.id] = team;

    return acc;
  }, {});
};

export const getTeam = async (
  api: Api,
  teamId: string,
): Promise<TeamDetails> => {
  return await api.get(`v2/teams/${teamId}`);
};

export const createTeam = async (api: Api, name: string): Promise<Team> => {
  return await api.post(`v2/teams`, { name });
};

export const inviteToTeam = async (
  api: Api,
  teamId: string,
): Promise<TeamInvitation> => {
  return await api.post(`v2/teams/${teamId}/invite`);
};

export const joinTeam = async (
  api: Api,
  invitationToken: string,
): Promise<Team> => {
  return await api.post(`v2/teams/join`, { token: invitationToken });
};

export const leaveTeam = async (api: Api, teamId: string) => {
  return await api.post(`v2/teams/${teamId}/leave`);
};
