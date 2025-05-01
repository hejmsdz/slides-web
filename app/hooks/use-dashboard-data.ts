import { useMatches } from "react-router";
import { ServerData } from "~/routes/dashboard";

export default function useDashboardData(): ServerData {
  const matches = useMatches().find(({ id }) => id === "routes/dashboard");
  if (!matches) {
    throw new Error("Could not access user data");
  }

  return matches.data as ServerData;
}
