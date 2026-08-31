import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/axios";
import type {
  PlatformListResponse,
  PlatformSingleResponse,
  CreatePlatformInput,
  UpdatePlatformInput,
  PlatformQueryParams,
} from "@/features/platforms/types";

function buildQueryString(params: PlatformQueryParams): string {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  const str = query.toString();
  return str ? `?${str}` : "";
}

export async function getPlatforms(
  params: PlatformQueryParams = {}
): Promise<PlatformListResponse> {
  const queryString = buildQueryString(params);
  return apiGet<PlatformListResponse>(`/platforms${queryString}`);
}

export async function getPlatformById(
  id: string
): Promise<PlatformSingleResponse> {
  return apiGet<PlatformSingleResponse>(`/platforms/${id}`);
}

export async function createPlatform(
  data: CreatePlatformInput
): Promise<PlatformSingleResponse> {
  return apiPost<PlatformSingleResponse>("/platforms", data);
}

export async function updatePlatform(
  id: string,
  data: UpdatePlatformInput
): Promise<PlatformSingleResponse> {
  return apiPut<PlatformSingleResponse>(`/platforms/${id}`, data);
}

export async function deletePlatform(
  id: string
): Promise<{ success: boolean; message: string; data: { id: string } }> {
  return apiDelete(`/platforms/${id}`);
}
