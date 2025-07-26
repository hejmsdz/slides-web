import { LoaderFunctionArgs, redirect } from "react-router";
import { defaultApi } from "~/api/api";
import { getLiveStatus } from "~/api/live";

const validLiveKeyRegex = /^\d{4}$/;

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.live || !validLiveKeyRegex.test(params.live)) {
    throw new Response("Not found", { status: 404 });
  }

  try {
    const { url } = await getLiveStatus(defaultApi, params.live);

    return redirect(url);
  } catch (error) {
    console.error(error);
    throw new Response("Not found", { status: 404 });
  }
}
