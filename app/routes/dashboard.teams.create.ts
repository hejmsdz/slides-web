import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createTeam } from "~/api/teams";
import { createAuthenticatedAction } from "~/routing.server";
import { commitSession } from "~/session";

export const action = createAuthenticatedAction(
  async ({ request }, { api, session }) => {
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
  },
);
