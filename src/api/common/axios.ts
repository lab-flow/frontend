import api from "./api";
import { AxiosResponse } from "axios";
import { GetWithPaginationResponse } from "../interfaces/getWithPaginationResponse.ts";

const POST_MULTIPART_FORM_DATA_CONFIG = {
  headers: {
    "Content-Type": "multipart/utils-data",
  },
};

export const get = async <T>(
  endpoint: string,
  additional = "",
): Promise<AxiosResponse> => {
  return await api.get<T>(`${endpoint}${additional}`);
};

export const getFile = async <T>(
  endpoint: string,
  additional = "",
): Promise<AxiosResponse> => {
  return await api.get<T>(`${endpoint}${additional}`, { responseType: "blob" });
};

export const getNoPagination = async (
  endpoint: string,
  additional = "",
): Promise<AxiosResponse> => {
  return get(endpoint, `?no_pagination${additional ? `&${additional}` : ""}`);
};

export const patch = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  return await api.patch<T>(endpoint, JSON.stringify(data));
};

export const put = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  return await api.put<T>(endpoint, JSON.stringify(data));
};

export const delete_ = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  return await api.delete<T>(endpoint, { data: JSON.stringify(data) });
};

export const post = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  return api.post<T>(endpoint, JSON.stringify(data));
};

export const post_multipart_form_data = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    values.forEach((element) => {
      formData.append(key, element);
    });
  }

  return await api.post<T>(endpoint, formData, POST_MULTIPART_FORM_DATA_CONFIG);
};

export const patch_multipart_form_data = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    values.forEach((element) => {
      formData.append(key, element);
    });
  }

  return await api.patch<T>(
    endpoint,
    formData,
    POST_MULTIPART_FORM_DATA_CONFIG,
  );
};

export const put_multipart_form_data = async <T>(
  endpoint: string,
  data: object,
): Promise<AxiosResponse> => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    values.forEach((element) => {
      formData.append(key, element);
    });
  }

  return await api.put<T>(endpoint, formData, POST_MULTIPART_FORM_DATA_CONFIG);
};

export const getWithPagination = async (
  endpoint: string,
  limit: number,
  page: number,
  additional = "",
): Promise<GetWithPaginationResponse> => {
  const offset = limit * page;
  const result: AxiosResponse<GetWithPaginationResponse> = await get(
    `${endpoint}?limit=${limit}&offset=${offset}${
      additional ? `&${additional}` : ""
    }`,
  );
  const pagesCount = Math.ceil(result.data.count / limit);
  return { ...result.data, pagesCount };
};
