import { type ApiType as Api } from "./api";

export type Song = {
  id: string;
  title: string;
  subtitle?: string;
  teamId?: string;
  isOverride?: boolean;
  isUnofficial?: boolean;
};

export type SongWithLyrics = Song & {
  author?: string;
  lyrics: string[];
  overriddenSongId?: string;
  canEdit: boolean;
  canDelete: boolean;
  canOverride: boolean;
};

export type SongData = Omit<
  SongWithLyrics,
  "id" | "canEdit" | "canDelete" | "canOverride"
>;

export const getSongs = async (
  api: Api,
  {
    teamId,
    query,
    limit,
    offset,
  }: { teamId?: string; query?: string; limit: number; offset: number },
): Promise<{ items: Song[]; total: number }> => {
  return api.get("v2/songs", {
    ...(teamId && { teamId }),
    ...(query && { query }),
    limit: limit.toString(),
    offset: offset.toString(),
  });
};

export const getSong = async (
  api: Api,
  id: string,
): Promise<SongWithLyrics> => {
  return api.get(`v2/songs/${id}`);
};

export const patchSong = async (
  api: Api,
  id: string,
  data: SongData,
): Promise<SongWithLyrics> => {
  return api.patch(`v2/songs/${id}`, data);
};

export const destroySong = async (api: Api, id: string): Promise<void> => {
  return api.destroy(`v2/songs/${id}`);
};

export const postSong = async (
  api: Api,
  data: SongData,
): Promise<SongWithLyrics> => {
  return api.post("v2/songs", data);
};
