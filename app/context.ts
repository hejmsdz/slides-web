import {
  createContext,
  redirect,
  RouterContextProvider,
  MiddlewareFunction,
} from "react-router";
import {
  Session,
  requireSessionWithRefresh,
  createAuthenticatedApi,
} from "./session";
import Api from "./api/api";

export const sessionContext = createContext<{
  session: Session;
  api: Api;
} | null>(null);

export function getSessionContext(context: Readonly<RouterContextProvider>) {
  const contextValue = context.get(sessionContext);

  if (!contextValue) {
    throw redirect("/");
  }

  return contextValue;
}

export const authMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  const { session, cookieToSet } = await requireSessionWithRefresh(request);
  const api = createAuthenticatedApi(session);

  context.set(sessionContext, {
    session,
    api,
  });

  try {
    const response = await next();

    if (cookieToSet) {
      response.headers.append("Set-Cookie", cookieToSet);
    }

    return response;
  } catch (error) {
    if (cookieToSet && error instanceof Response) {
      error.headers.append("Set-Cookie", cookieToSet);
    }
    throw error;
  }
};
