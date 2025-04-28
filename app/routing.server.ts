import { ActionFunctionArgs } from "react-router";
import {
  createAuthenticatedApi,
  requireSessionWithRefresh,
  Session,
} from "./session";
import { ApiType } from "~/api/api";

export const createAuthenticatedAction = (
  action: (
    args: ActionFunctionArgs,
    {
      api,
      session,
      headers,
    }: { api: ApiType; session: Session; headers: Headers },
  ) => Response | Promise<Response> | unknown,
) => {
  return async (args: ActionFunctionArgs) => {
    const headers = new Headers();
    const { request } = args;

    const session = await requireSessionWithRefresh(request, headers);
    const api = await createAuthenticatedApi(session);

    const result = await action(args, { api, session, headers });

    return result;
  };
};
