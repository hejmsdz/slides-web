import { ActionFunctionArgs } from "react-router";
import { requireSession, logOut } from "~/session";

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireSession(request);
  return logOut(session);
}
