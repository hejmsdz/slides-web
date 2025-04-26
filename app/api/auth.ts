import { type ApiType as Api } from "./api";
import { User } from "./users";

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export const postGoogleAuth = async (
  api: Api,
  idToken: string,
): Promise<AuthResponse> => {
  return api.post("v2/auth/google", { idToken });
};

export const postRefreshToken = async (
  api: Api,
  refreshToken: string,
): Promise<AuthResponse> => {
  return api.post("v2/auth/refresh", { refreshToken });
};

export const deleteRefreshToken = async (
  api: Api,
  refreshToken: string,
): Promise<AuthResponse> => {
  return api.destroy("v2/auth/refresh", { refreshToken });
};
