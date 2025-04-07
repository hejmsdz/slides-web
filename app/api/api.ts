const apiUrl = process.env.API_URL;

export const get = async (
  path: string,
  params?: Record<string, string>,
  options?: RequestInit,
) => {
  const url = new URL(path, apiUrl);
  if (params) {
    url.search = new URLSearchParams(params).toString();
  }

  // const session = await getSession();

  const response = await fetch(url, {
    ...options,
    headers: {
      // ...(session.token && { authorization: `Bearer ${session.token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json();

    /*
    if (
      response.status === 401 &&
      data.error === "token expired" &&
      path !== "v2/auth/refresh"
    ) {
      if (typeof window === "undefined") {
        await refreshAccessToken();
      } else {
        throw new Error("token expired");
      }

      return get(path, params, options);
    }
    */

    if (data.error) {
      throw new Error(`API error: ${data.error}`);
    } else {
      throw new Error(`Unknown API error: ${JSON.stringify(data)}`);
    }
  }

  if (response.status === 204) {
    return;
  }

  try {
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const post = async <T>(
  path: string,
  data?: T,
  { headers, ...restOptions }: RequestInit = {},
) => {
  return get(path, undefined, {
    method: "POST",
    headers: {
      ...(data && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: data && JSON.stringify(data),
    ...restOptions,
  });
};

export const patch = async <T>(
  path: string,
  data: T,
  options?: RequestInit,
) => {
  return post(path, data, {
    method: "PATCH",
    ...options,
  });
};

export const destroy = async <T>(
  path: string,
  data?: T | undefined,
  options?: RequestInit,
) => {
  return post(path, data, {
    method: "DELETE",
    ...options,
  });
};

/*
export type Team = {
  id: string;
  name: string;
};

export const getTeams = async (): Promise<Record<string, Team>> => {
  const teams = await get("v2/teams");

  return teams.reduce((acc: Record<string, Team>, team: Team) => {
    acc[team.id] = team;

    return acc;
  }, {});
};
export type AuthResponse = {
  token: string;
  refreshToken: string;
  name: string;
};

export const postGoogleAuth = async (
  idToken: string,
): Promise<AuthResponse> => {
  return post(`v2/auth/google`, { idToken });
};

export const postRefreshToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  return post(`v2/auth/refresh`, { refreshToken });
};

export const deleteRefreshToken = async (
  refreshToken: string,
): Promise<AuthResponse> => {
  return destroy(`v2/auth/refresh`, { refreshToken });
};

type DeckResponse = {
  url: string;
};

export const postDeck = async (data: object): Promise<DeckResponse> => {
  return post(`v2/deck`, data);
};
*/
