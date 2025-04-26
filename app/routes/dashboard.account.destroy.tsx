import { destroyUsersMe } from "~/api/users";
import { redirect } from "react-router";
import { createAuthenticatedAction } from "~/routing.server";
import { destroySession } from "~/session";

export const action = createAuthenticatedAction(async (_, { api, session }) => {
  await destroyUsersMe(api);

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
});
