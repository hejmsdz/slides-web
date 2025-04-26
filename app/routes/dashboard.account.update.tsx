import invariant from "tiny-invariant";
import { patchUsersMe } from "~/api/users";
import { redirect } from "@remix-run/react";
import { createAuthenticatedAction } from "~/routing.server";
import { commitSession } from "~/session";

export const action = createAuthenticatedAction(
  async ({ request }, { api, session }) => {
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
  },
);
