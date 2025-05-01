import { loader } from "./routes/dashboard";

type ServerData = Awaited<ReturnType<typeof loader>>;

let cachedServerData: ServerData | null = null;

export function exists() {
  return cachedServerData !== null;
}

export function get() {
  return cachedServerData;
}

export function set(data: ServerData) {
  cachedServerData = data;
}

export function clear() {
  cachedServerData = null;
}
