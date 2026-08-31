import { useQuery } from "@tanstack/react-query";
import { getAdminStats, getPlatformStats } from "@/features/stats/api/stats.api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
    staleTime: 60_000,
  });
}

export function usePlatformStats(platform: string) {
  return useQuery({
    queryKey: ["platform-stats", platform],
    queryFn: () => getPlatformStats(platform),
    staleTime: 60_000,
  });
}
