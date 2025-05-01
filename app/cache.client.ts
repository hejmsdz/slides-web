import { ClientActionFunctionArgs } from "react-router";
import { ServerData } from "./routes/dashboard";

let cachedServerData: ServerData | null = null;

export function get() {
  return cachedServerData;
}

export function set(data: ServerData) {
  cachedServerData = data;
}

export function clear() {
  cachedServerData = null;
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const result = await serverAction();
  clear();

  return result;
}
