import { useMatches } from "react-router";

export default function useDashboardData() {
  const matches = useMatches().find(({ id }) => id === "routes/dashboard");
  if (!matches) {
    return null;
  }

  return matches.data;
}
