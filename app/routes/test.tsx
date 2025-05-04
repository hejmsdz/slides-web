import { redirect } from "react-router";

export function loader() {
  const testUrl = process.env.TEST_URL;

  if (!testUrl) {
    throw new Response("Not found", { status: 404 });
  }

  return redirect(testUrl);
}
