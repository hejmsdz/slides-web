import { type ApiType as Api } from "./api";

export type Song = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  teamId?: string;
  isOverride?: boolean;
};

export type SongWithLyrics = Song & {
  lyrics: string[];
  overriddenSongId?: string;
  // canEdit: boolean;
  // canDelete: boolean;
  // canOverride: boolean;
};

export const getSongs = async (
  api: Api,
  { teamId }: { teamId: string },
): Promise<Song[]> => {
  return api.get("v2/songs", { teamId });
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
  data: Omit<SongWithLyrics, "id" | "slug">,
): Promise<SongWithLyrics> => {
  return api.patch(`v2/songs/${id}`, data);
};

export const destroySong = async (api: Api, id: string): Promise<void> => {
  return api.destroy(`v2/songs/${id}`);
};

export const postSong = async (
  api: Api,
  data: Omit<SongWithLyrics, "id" | "slug">,
): Promise<SongWithLyrics> => {
  return api.post("v2/songs", data);
};
