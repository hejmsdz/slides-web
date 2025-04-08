import { ActionFunctionArgs } from "@remix-run/node";
import { requireSession, logOut } from "~/session";

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireSession(request);
  return logOut(session);
}
