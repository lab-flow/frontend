import {
  delete_,
  get,
  getFile,
  getNoPagination,
  getWithPagination,
  patch,
  patch_multipart_form_data,
  post,
  post_multipart_form_data,
  put,
  put_multipart_form_data,
} from "../common/axios.ts";
import { AxiosResponse } from "axios";
import { GetWithPaginationResponse } from "../interfaces/getWithPaginationResponse.ts";

class DataProvider {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getItem = async (id?: number | string, additionalParams = "") => {
    const itemId = id ? id + "/" : "";
    return await get(`/${this.endpoint}/${itemId}${additionalParams}`);
  };

  getItemFile = async (id?: number | string, additionalParams = "") => {
    const itemId = id ? id + "/" : "";
    return await getFile(`/${this.endpoint}/${itemId}${additionalParams}`);
  };

  getItemList = async (
    limit: number | undefined = 100,
    page: number | undefined = 0,
    noPagination: boolean | undefined = false,
    additionalParams: string | undefined = "",
  ): Promise<AxiosResponse | GetWithPaginationResponse> => {
    if (noPagination) {
      return await getNoPagination(`/${this.endpoint}/`, additionalParams);
    }
    return await getWithPagination(
      `/${this.endpoint}/`,
      limit,
      page,
      additionalParams,
    );
  };

  createItem = async (data: object) => {
    return await post(`/${this.endpoint}/`, data);
  };

  createMultipartItem = async (data: object) => {
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof FileList) {
        // eslint-disable-next-line
        // @ts-ignore
        data[key] = value[0];
      }
    }
    return await post_multipart_form_data(`/${this.endpoint}/`, data);
  };

  updateItem = async (data: object) => {
    // eslint-disable-next-line
    // @ts-ignore
    return await patch(`/${this.endpoint}/${data.id}/`, data);
  };

  updateAllItem = async (data: { id: number }) => {
    return await put(`/${this.endpoint}/${data.id}/`, data);
  };

  updateMultipartItem = async (data: { id: number; value?: FileList }) => {
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof FileList) {
        // eslint-disable-next-line
        // @ts-ignore
        data[key] = value[0];
      }
    }
    return await patch_multipart_form_data(
      `/${this.endpoint}/${data.id}/`,
      data,
    );
  };

  updateAllMultipartItemWithoutId = async (data: { value?: FileList }) => {
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof FileList) {
        // eslint-disable-next-line
        // @ts-ignore
        data[key] = value[0];
      }
    }
    return await put_multipart_form_data(`/${this.endpoint}/`, data);
  };

  deleteItem = async (data: { id: number | undefined }) => {
    return await delete_(`/${this.endpoint}/${data.id}/`, data);
  };
}

export const DataProviders = {
  REAGENTS: new DataProvider("reagents"),
  PERSONAL_REAGENTS: new DataProvider("personal-reagents"),
  PERSONAL_REAGENTS_ME: new DataProvider("personal-reagents/me"),
  REAGENT_REQUESTS: new DataProvider("reagent-requests"),
  USERS: new DataProvider("users"),
  PRODUCERS: new DataProvider("producers"),
  UNITS: new DataProvider("units"),
  SAFETY_INSTRUCTIONS: new DataProvider("safety-instructions"),
  SAFETY_DATA_SHEETS: new DataProvider("safety-data-sheets"),
  ADMIN_LOGS: new DataProvider("admin-logs"),
  REAGENT_TYPES: new DataProvider("reagent-types"),
  STORAGE_CONDITIONS: new DataProvider("storage-conditions"),
  PURITIES_QUALITIES: new DataProvider("purities-qualities"),
  PRECAUTIONARY_STATEMENT: new DataProvider("precautionary-statements"),
  LABORATORIES: new DataProvider("laboratories"),
  CLP_CLASSIFICATIONS: new DataProvider("clp-classifications"),
  CLASSIFICATIONS: new DataProvider("classifications"),
  HAZARD_STATEMENTS: new DataProvider("hazard-statements"),
  HAZARD_STATEMENTS_GHS: new DataProvider("hazard-statements/ghs-pictograms"),
  CONCENTRATIONS: new DataProvider("concentrations"),
  PROJECT_PROCEDURES: new DataProvider("projects-procedures"),
  PICTOGRAMS: new DataProvider("pictograms"),
  REAGENT_REQUESTS_ME: new DataProvider("reagent-requests/me"),
  LAB_MANAGER_REPORT: new DataProvider("personal-reagents/report/lab-manager"),
  SANEPID_PIP_REPORT: new DataProvider("personal-reagents/report/sanepid-pip"),
  USER_MANUAL: new DataProvider("user-manual"),
  PROJECT_PROCEDURE_REPORT: new DataProvider(
    "personal-reagents/report/projects-procedures",
  ),
  ALL_REPORT: new DataProvider("personal-reagents/report/all"),
  PERSONAL_VIEW_REPORT: new DataProvider(
    "personal-reagents/report/personal-view",
  ),
  STATISTICS: new DataProvider("personal-reagents/statistics"),
  REAGENTS_PENDING_VALIDATION_FIELDS: new DataProvider(
    "notifications/reagents/pending-validation-fields",
  ),
  PERSONAL_REAGENT_REQUEST_NOTIFICATIONS: new DataProvider(
    "notifications/reagent-requests",
  ),
  GENERATE_USAGE_RECORD_NOTIFICATIONS: new DataProvider(
    "notifications/reagents/not-generated-usage-records",
  ),
  CLOSE_EXPIRATION_DATE_NOTIFICATIONS: new DataProvider(
    "notifications/reagents/close-expiration-date",
  ),
  FEW_CRITICAL_NOTIFICATIONS: new DataProvider(
    "notifications/reagents/few-critical",
  ),
};

export const getLogs = (dataProvider: DataProvider) => {
  return new DataProvider(`${dataProvider.endpoint}/history`);
};

export const getDataProviderByName = (name: string) => {
  switch (name) {
    case "ReagentType":
      return DataProviders.REAGENT_TYPES;
    case "Reagent":
      return DataProviders.REAGENTS;
    case "Producer":
      return DataProviders.PRODUCERS;
    case "Concentration":
      return DataProviders.CONCENTRATIONS;
    case "Unit":
      return DataProviders.UNITS;
    case "PurityQuality":
      return DataProviders.PURITIES_QUALITIES;
    case "StorageCondition":
      return DataProviders.STORAGE_CONDITIONS;
    default:
      return null;
  }
};
