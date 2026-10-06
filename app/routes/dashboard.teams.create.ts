import { redirect, ActionFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { createTeam } from "~/api/teams";
import { getSessionContext } from "~/context";
import { commitSession } from "~/session";

export async function action({ request, context }: ActionFunctionArgs) {
  const { api, session } = getSessionContext(context);

  const formData = await request.formData();

  const name = formData.get("name")?.toString();
  invariant(name, "name is required");

  const { id } = await createTeam(api, name);

  session.set("teamId", id);
  return redirect(`/dashboard/settings`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
