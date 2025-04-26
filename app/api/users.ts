import Api from "./api";

export type User = {
  id: string;
  displayName: string;
  email: string;
};

export const getUsersMe = async (api: Api): Promise<User> => {
  return api.get("v2/users/me");
};

type UserUpdate = Pick<User, "displayName">;

export const patchUsersMe = async (
  api: Api,
  user: UserUpdate,
): Promise<User> => {
  return api.patch("v2/users/me", user);
};
