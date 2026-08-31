import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/axios";
import type {
  ManagerListResponse,
  ManagerSingleResponse,
  CreateManagerInput,
  UpdateManagerInput,
  ManagerQueryParams,
} from "@/features/managers/types";

function buildQueryString(params: ManagerQueryParams): string {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  const str = query.toString();
  return str ? `?${str}` : "";
}

export async function getManagers(
  params: ManagerQueryParams = {}
): Promise<ManagerListResponse> {
  const queryString = buildQueryString(params);
  return apiGet<ManagerListResponse>(`/managers${queryString}`);
}

export async function getManagerById(
  id: string
): Promise<ManagerSingleResponse> {
  return apiGet<ManagerSingleResponse>(`/managers/${id}`);
}

export async function createManager(
  data: CreateManagerInput
): Promise<ManagerSingleResponse> {
  return apiPost<ManagerSingleResponse>("/managers", data);
}

export async function updateManager(
  id: string,
  data: UpdateManagerInput
): Promise<ManagerSingleResponse> {
  return apiPut<ManagerSingleResponse>(`/managers/${id}`, data);
}

export async function changeManagerPassword(
  id: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  return apiPatch(`/managers/${id}/password`, { password });
}

export async function updateManagerStatus(
  id: string,
  active: boolean
): Promise<ManagerSingleResponse> {
  return apiPatch<ManagerSingleResponse>(`/managers/${id}/status`, { active });
}

export async function deleteManager(
  id: string
): Promise<{ success: boolean; message: string; data: { id: string } }> {
  return apiDelete(`/managers/${id}`);
}
