import { apiGet } from "@/lib/axios";
import type { AdminStatsResponse, PlatformStatsResponse } from "@/features/stats/types";

export async function getAdminStats(): Promise<AdminStatsResponse> {
  return apiGet<AdminStatsResponse>("/stats/admin");
}

export async function getPlatformStats(platform: string): Promise<PlatformStatsResponse> {
  return apiGet<PlatformStatsResponse>(`/stats/admin/platform/${platform}`);
}
