import { ActionFunctionArgs } from "@remix-run/node";
import { createAuthenticatedApi, requireSession } from "./session";
import { ApiType } from "~/api/api";

export const createAuthenticatedAction = (
  action: (
    args: ActionFunctionArgs,
    { api, headers }: { api: ApiType; headers: Headers },
  ) => Response | Promise<Response> | unknown,
) => {
  return async (args: ActionFunctionArgs) => {
    const headers = new Headers();
    const { request } = args;

    const session = await requireSession(request, headers);
    const api = await createAuthenticatedApi(session);

    const result = await action(args, { api, headers });

    return result;
  };
};
