"use client";

import { format } from "date-fns";
import { LayoutDashboard, Loader2, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useAdminStats, usePlatformStats } from "@/features/stats/hooks/use-stats";
import { StatsCards } from "@/features/stats/components/stats-cards";
import { UserGrowthChart } from "@/features/stats/components/user-growth-chart";
import { PlatformDistributionChart } from "@/features/stats/components/platform-distribution-chart";
import { ManagerPerformanceChart } from "@/features/stats/components/manager-performance-chart";
import { EnrollmentTrendChart } from "@/features/stats/components/enrollment-trend-chart";
import { RecentActivity } from "@/features/stats/components/recent-activity";
import { QuickActions } from "@/features/stats/components/quick-actions";
import { PlatformUsersTable } from "@/features/stats/components/platform-users-table";
import { PlatformCharts } from "@/features/stats/components/platform-charts";
import { Button } from "@/components/ui/button";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[110px] animate-pulse rounded-lg bg-muted/50" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50 lg:col-span-3" />
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50 lg:col-span-2" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50" />
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const { data: adminData, isLoading: adminIsLoading, isError, refetch, isFetching } = useAdminStats();

  // Fetch platform stats in parallel
  const {
    data: amazonData,
    isLoading: amazonIsLoading,
    isError: amazonIsError,
  } = usePlatformStats("amazon");

  const {
    data: websiteData,
    isLoading: websiteIsLoading,
    isError: websiteIsError,
  } = usePlatformStats("website");

  const {
    data: etsyData,
    isLoading: etsyIsLoading,
    isError: etsyIsError,
  } = usePlatformStats("etsy");

  if (isError || amazonIsError || websiteIsError || etsyIsError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
          <svg className="size-7 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Failed to load dashboard</p>
          <p className="mt-1 text-xs text-muted-foreground">Please check your connection and try again.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="size-3.5" />
          Try again
        </Button>
      </div>
    );
  }

  const stats = adminData?.data;

  // Handle platform errors
  const platformErrors = amazonIsError || websiteIsError || etsyIsError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <LayoutDashboard className="size-4.5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Welcome back, {user?.name}. Here&apos;s your overview for{" "}
                {format(new Date(), "MMMM d, yyyy")}.
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5"
        >
          <RefreshCw
            className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {adminIsLoading ? (
        <LoadingSkeleton />
      ) : stats ? (
        <>
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <QuickActions />
              {/* <UserGrowthChart data={stats.monthlyGrowth} /> */}
            </div>
            <div className="lg:col-span-2">
              <PlatformDistributionChart data={stats.usersByPlatform} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ManagerPerformanceChart data={stats.usersByManager} />
            <EnrollmentTrendChart data={stats.enrollmentsByMonth} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RecentActivity users={stats.recentUsers} />
            </div>
            <div className="lg:col-span-2">
              <UserGrowthChart data={stats.monthlyGrowth} />
            </div>
          </div>

          {/* Platform-specific sections */}
          <div className="mt-6 space-y-4">
            <h2 className="font-heading text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Platform Users
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <PlatformUsersTable
                data={
                  amazonData?.data ?? {
                    platform: "amazon",
                    totalCount: 0,
                    activeCount: 0,
                    inactiveCount: 0,
                    usersByManager: [],
                    usersByBatch: [],
                    monthlyEnrollments: [],
                    recentUsers: [],
                  }
                }
                platform="amazon"
              />
              <PlatformUsersTable
                data={
                  websiteData?.data ?? {
                    platform: "website",
                    totalCount: 0,
                    activeCount: 0,
                    inactiveCount: 0,
                    usersByManager: [],
                    usersByBatch: [],
                    monthlyEnrollments: [],
                    recentUsers: [],
                  }
                }
                platform="website"
              />
              <PlatformUsersTable
                data={
                  etsyData?.data ?? {
                    platform: "etsy",
                    totalCount: 0,
                    activeCount: 0,
                    inactiveCount: 0,
                    usersByManager: [],
                    usersByBatch: [],
                    monthlyEnrollments: [],
                    recentUsers: [],
                  }
                }
                platform="etsy"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PlatformCharts
                data={
                  amazonData?.data ?? {
                    platform: "amazon",
                    totalCount: 0,
                    activeCount: 0,
                    inactiveCount: 0,
                    usersByManager: [],
                    usersByBatch: [],
                    monthlyEnrollments: [],
                    recentUsers: [],
                  }
                }
                platform="amazon"
              />
              <PlatformCharts
                data={
                  websiteData?.data ?? {
                    platform: "website",
                    totalCount: 0,
                    activeCount: 0,
                    inactiveCount: 0,
                    usersByManager: [],
                    usersByBatch: [],
                    monthlyEnrollments: [],
                    recentUsers: [],
                  }
                }
                platform="website"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}