import Api from "./api";

export type Bootstrap = {
  appDownloadUrl: string;
  contactUrl?: string;
};

export const getBootstrap = async (api: Api): Promise<Bootstrap> => {
  return api.get("v2/bootstrap");
};
