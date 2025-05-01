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
