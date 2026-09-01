"use client";

import { format } from "date-fns";
import { LayoutDashboard, RefreshCw, Users, UserCheck, UserX, Award } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useManagerStats } from "@/features/stats/hooks/use-stats";
import { UserGrowthChart } from "@/features/stats/components/user-growth-chart";
import { PlatformDistributionChart } from "@/features/stats/components/platform-distribution-chart";
import { EnrollmentTrendChart } from "@/features/stats/components/enrollment-trend-chart";
import { RecentActivity } from "@/features/stats/components/recent-activity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[110px] animate-pulse rounded-lg bg-muted/50" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50" />
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50" />
        <div className="h-[380px] animate-pulse rounded-lg bg-muted/50" />
      </div>
    </div>
  );
}

const statCards = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    gradient: "from-chart-4/15 to-chart-4/5",
    iconBg: "bg-chart-4/15",
    iconColor: "text-chart-4",
    getValue: (s: { totalUsers: number }) => s.totalUsers,
    getTrend: () => null,
  },
  {
    key: "activeUsers",
    label: "Active Users",
    icon: UserCheck,
    gradient: "from-emerald-500/15 to-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    getValue: (s: { activeUsers: number; totalUsers: number }) => s.activeUsers,
    getTrend: (s: { activeUsers: number; totalUsers: number }) =>
      `${Math.round((s.activeUsers / Math.max(s.totalUsers, 1)) * 100)}% of total`,
  },
  {
    key: "inactiveUsers",
    label: "Inactive Users",
    icon: UserX,
    gradient: "from-destructive/15 to-destructive/5",
    iconBg: "bg-destructive/15",
    iconColor: "text-destructive",
    getValue: (s: { inactiveUsers: number }) => s.inactiveUsers,
    getTrend: (s: { inactiveUsers: number; totalUsers: number }) =>
      `${Math.round((s.inactiveUsers / Math.max(s.totalUsers, 1)) * 100)}% of total`,
  },
  {
    key: "totalEnrollments",
    label: "Total Enrollments",
    icon: Award,
    gradient: "from-chart-1/15 to-chart-1/5",
    iconBg: "bg-chart-1/15",
    iconColor: "text-chart-1",
    getValue: (s: { totalEnrollments: number }) => s.totalEnrollments,
    getTrend: () => null,
  },
];

function ManagerStatsCards({ stats }: { stats: { totalUsers: number; activeUsers: number; inactiveUsers: number; totalEnrollments: number } }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(stats);
        const trend = card.getTrend(stats);
        return (
          <Card
            key={card.key}
            className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60`} />
            <CardContent className="relative">
              <div className="flex items-start justify-between">
                <div className={`flex size-9 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`size-4 ${card.iconColor}`} />
                </div>
                {trend && (
                  <span className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    {trend}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <p className="font-heading text-xl font-bold tracking-tight">{value}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function ManagerPage() {
  const { user } = useAuthStore();
  const { data: managerData, isLoading, isError, refetch, isFetching } = useManagerStats();

  if (isError) {
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

  const stats = managerData?.data;

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

      {isLoading ? (
        <LoadingSkeleton />
      ) : stats ? (
        <>
          <ManagerStatsCards stats={stats} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PlatformDistributionChart data={stats.usersByPlatform} />
            <EnrollmentTrendChart data={stats.enrollmentsByMonth} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RecentActivity users={stats.recentUsers} viewAllHref="/manager/users" />
            </div>
            <div className="lg:col-span-2">
              <UserGrowthChart data={stats.monthlyGrowth} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
