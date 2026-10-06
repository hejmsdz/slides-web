import { destroyUsersMe } from "~/api/users";
import { redirect, ActionFunctionArgs } from "react-router";
import { getSessionContext } from "~/context";
import { destroySession } from "~/session";

export async function action({ context }: ActionFunctionArgs) {
  const { api, session } = getSessionContext(context);

  await destroyUsersMe(api);

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
