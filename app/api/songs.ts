import { get, post, patch, destroy } from "./api";

export type Song = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  teamId?: string;
};

export type SongWithLyrics = Song & {
  lyrics: string[];
  // canEdit: boolean;
  // canDelete: boolean;
  // canOverride: boolean;
};

export const getSongs = async (): Promise<Song[]> => {
  return get("v2/songs", { query: "---" });
};

export const getSong = async (id: string): Promise<SongWithLyrics> => {
  return get(`v2/songs/${id}`);
};

export const patchSong = async (
  id: string,
  data: Omit<SongWithLyrics, "id" | "slug">,
): Promise<SongWithLyrics> => {
  return patch(`v2/songs/${id}`, data);
};

export const destroySong = async (id: string): Promise<void> => {
  return destroy(`v2/songs/${id}`);
};

export const postSong = async (
  data: Omit<SongWithLyrics, "id" | "slug">,
): Promise<SongWithLyrics> => {
  return post(`v2/songs`, data);
};
