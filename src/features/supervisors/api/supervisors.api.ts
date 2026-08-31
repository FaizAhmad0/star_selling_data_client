import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/axios";
import type {
  SupervisorListResponse,
  SupervisorSingleResponse,
  CreateSupervisorInput,
  UpdateSupervisorInput,
  SupervisorQueryParams,
} from "@/features/supervisors/types";

function buildQueryString(params: SupervisorQueryParams): string {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  const str = query.toString();
  return str ? `?${str}` : "";
}

export async function getSupervisors(params: SupervisorQueryParams = {}): Promise<SupervisorListResponse> {
  const queryString = buildQueryString(params);
  return apiGet<SupervisorListResponse>(`/supervisors${queryString}`);
}

export async function getSupervisorById(id: string): Promise<SupervisorSingleResponse> {
  return apiGet<SupervisorSingleResponse>(`/supervisors/${id}`);
}

export async function createSupervisor(data: CreateSupervisorInput): Promise<SupervisorSingleResponse> {
  return apiPost<SupervisorSingleResponse>("/supervisors", data);
}

export async function updateSupervisor(id: string, data: UpdateSupervisorInput): Promise<SupervisorSingleResponse> {
  return apiPut<SupervisorSingleResponse>(`/supervisors/${id}`, data);
}

export async function changeSupervisorPassword(id: string, password: string): Promise<{ success: boolean; message: string }> {
  return apiPatch(`/supervisors/${id}/password`, { password });
}

export async function updateSupervisorStatus(id: string, active: boolean): Promise<SupervisorSingleResponse> {
  return apiPatch<SupervisorSingleResponse>(`/supervisors/${id}/status`, { active });
}

export async function deleteSupervisor(id: string): Promise<{ success: boolean; message: string; data: { id: string } }> {
  return apiDelete(`/supervisors/${id}`);
}
