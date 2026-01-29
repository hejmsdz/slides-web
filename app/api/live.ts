import Api from "./api";

type LiveStatus = {
  url: string;
  currentPage: number;
  backgroundColor: string;
};

export const getLiveStatus = async (
  api: Api,
  key: string,
): Promise<LiveStatus> => {
  return api.get(`v2/live/${key}/status`);
};
