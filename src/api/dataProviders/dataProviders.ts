import { delete_, get, getFile, patch } from "../common/axios";
import { DataProviders } from "./DataProvider.ts";

export const getPersonalReagentAllInfo = async (id: number) => {
  const personalReagentInfo = await DataProviders.PERSONAL_REAGENTS.getItem(id);
  const reagentId = personalReagentInfo.data?.reagent?.id;

  const reagentInfo = await DataProviders.REAGENTS.getItem(reagentId);
  return { ...reagentInfo.data, ...personalReagentInfo.data };
};

export const updateReagentRequestByResponder = async (data: {
  id: number;
  status: string;
  responder_comment: string;
}) => {
  return await patch(`/reagent-requests/${data.id}/status/`, data);
};

export const deleteReagentRequest = async (data: { id: number }) => {
  return await delete_(`/reagent-requests/${data.id}/`, data);
};

export const getSafetyInstruction = async (id: number) => {
  const response = await get(`safety-instructions/${id}/`);
  return response.data;
};

export const getSafetyDataSheet = async (id: number) => {
  const response = await get(`safety-data-sheets/${id}/`);
  return response.data;
};


export const getUsageRecord = async (id: number) => {
  return await getFile(`/personal-reagents/${id}/usage-record/`);
};
