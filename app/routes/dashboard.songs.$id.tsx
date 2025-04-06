import { LoaderFunctionArgs } from "@remix-run/node";
import { getSong } from "~/api/songs";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

export default function Song() {
  const { song } = useLoaderData<typeof loader>();

  return (
    <div>
      <pre>{JSON.stringify(song, null, 2)}</pre>
    </div>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "id is required");

  try {
    const song = await getSong(params.id);
    return { song };
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
}
