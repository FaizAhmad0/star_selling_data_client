import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/axios";
import type {
  UserListResponse,
  UserSingleResponse,
  CreateUserInput,
  UpdateUserInput,
  UserQueryParams,
  BulkUploadResult,
} from "@/features/users/types";

function buildQueryString(params: UserQueryParams): string {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.manager) query.set("manager", params.manager);
  if (params.batch) query.set("batch", params.batch);
  if (params.status) query.set("status", params.status);
  if (params.joiningDate) query.set("joiningDate", params.joiningDate);
  if (params.platform) query.set("platform", params.platform);
  const str = query.toString();
  return str ? `?${str}` : "";
}

export async function getUsers(params: UserQueryParams = {}): Promise<UserListResponse> {
  const queryString = buildQueryString(params);
  return apiGet<UserListResponse>(`/users${queryString}`);
}

export async function getUserById(id: string): Promise<UserSingleResponse> {
  return apiGet<UserSingleResponse>(`/users/${id}`);
}

export async function createUser(data: CreateUserInput): Promise<UserSingleResponse> {
  return apiPost<UserSingleResponse>("/users/create", data);
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<UserSingleResponse> {
  return apiPut<UserSingleResponse>(`/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<{ success: boolean; message: string; data: { id: string } }> {
  return apiDelete(`/users/${id}`);
}

export async function bulkCreateUsers(data: CreateUserInput[]): Promise<{ success: boolean; message: string; data: BulkUploadResult }> {
  return apiPost("/users/bulk-create", data);
}
