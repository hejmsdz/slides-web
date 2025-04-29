import useDashboardData from "./use-dashboard-data";

export function useIsWebView(): boolean {
  const data = useDashboardData();

  return data?.isWebView ?? false;
}
