import invariant from "tiny-invariant";
import { patchUsersMe } from "~/api/users";
import { redirect, ActionFunctionArgs } from "react-router";
import { getSessionContext } from "~/context";
import { commitSession } from "~/session";

export async function action({ request, context }: ActionFunctionArgs) {
  const { api, session } = getSessionContext(context);

  const formData = await request.formData();
  const displayName = formData.get("displayName")?.toString();
  invariant(displayName, "display name is required");

  const user = await patchUsersMe(api, { displayName });
  session.set("name", user.displayName);

  return redirect(`/dashboard/settings`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
