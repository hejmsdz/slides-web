const apiUrl = process.env.INTERNAL_API_URL;

type RequestOptions = {
  accessToken?: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

const get = async (
  path: string,
  params?: Record<string, string>,
  init?: RequestInit,
  customOptions?: RequestOptions,
) => {
  console.log("get", path);

  const url = new URL(path, apiUrl);
  if (params) {
    url.search = new URLSearchParams(params).toString();
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      ...(customOptions?.accessToken && {
        authorization: `Bearer ${customOptions.accessToken}`,
      }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json();

    if (data.error) {
      throw new ApiError(data.error, response.status);
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

const post = async <T>(
  path: string,
  data?: T,
  init?: RequestInit,
  customOptions?: RequestOptions,
) => {
  return get(
    path,
    undefined,
    {
      method: "POST",
      headers: {
        ...(data && { "Content-Type": "application/json" }),
        ...init?.headers,
      },
      body: data && JSON.stringify(data),
      ...init,
    },
    customOptions,
  );
};

const patch = async <T>(
  path: string,
  data: T,
  init?: RequestInit,
  customOptions?: RequestOptions,
) => {
  return post(
    path,
    data,
    {
      method: "PATCH",
      ...init,
    },
    customOptions,
  );
};

const destroy = async <T>(
  path: string,
  data?: T | undefined,
  init?: RequestInit,
  customOptions?: RequestOptions,
) => {
  return post(
    path,
    data,
    {
      method: "DELETE",
      ...init,
    },
    customOptions,
  );
};

class Api {
  customOptions: RequestOptions;

  constructor(private readonly accessToken?: string) {
    this.customOptions = {
      accessToken: this.accessToken,
    };
  }

  get(path: string, params?: Record<string, string>, init?: RequestInit) {
    return get(path, params, init, this.customOptions);
  }

  post<T>(path: string, data?: T, init?: RequestInit) {
    return post<T>(path, data, init, this.customOptions);
  }

  patch<T>(path: string, data: T, init?: RequestInit) {
    return patch<T>(path, data, init, this.customOptions);
  }

  destroy<T>(path: string, data?: T, init?: RequestInit) {
    return destroy<T>(path, data, init, this.customOptions);
  }
}

export const defaultApi = new Api();

export default Api;
export type ApiType = InstanceType<typeof Api>;
