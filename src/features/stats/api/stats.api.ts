import { apiGet } from "@/lib/axios";
import type { AdminStatsResponse, PlatformStatsResponse, ManagerStatsResponse } from "@/features/stats/types";

export async function getAdminStats(): Promise<AdminStatsResponse> {
  return apiGet<AdminStatsResponse>("/stats/admin");
}

export async function getPlatformStats(platform: string): Promise<PlatformStatsResponse> {
  return apiGet<PlatformStatsResponse>(`/stats/admin/platform/${platform}`);
}

export async function getManagerStats(): Promise<ManagerStatsResponse> {
  return apiGet<ManagerStatsResponse>("/stats/manager");
}
