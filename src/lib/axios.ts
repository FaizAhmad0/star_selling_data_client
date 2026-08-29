import axios from "axios";
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token here when authentication is implemented.
    // Example:
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ?? error.message ?? "An unexpected error occurred";

    const apiError: ApiError = {
      message,
      status,
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  },
);

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.patch<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

export default api;
