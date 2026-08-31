"use client";

import { Users, UserCheck, UserX, Shield, Eye, Layers, TrendingUp, TrendingDown, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminStats } from "@/features/stats/types";

interface StatsCardsProps {
  stats: AdminStats;
}

// Only 6 essential cards in one row
const cards = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    gradient: "from-chart-4/15 to-chart-4/5",
    iconBg: "bg-chart-4/15",
    iconColor: "text-chart-4",
    getValue: (s: AdminStats) => s.totalUsers,
    getTrend: () => null,
  },
  {
    key: "activeUsers",
    label: "Active Users",
    icon: UserCheck,
    gradient: "from-emerald-500/15 to-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    getValue: (s: AdminStats) => s.activeUsers,
    getTrend: (s: AdminStats) => `${Math.round((s.activeUsers / Math.max(s.totalUsers, 1)) * 100)}% of total`,
  },
  {
    key: "inactiveUsers",
    label: "Inactive Users",
    icon: UserX,
    gradient: "from-destructive/15 to-destructive/5",
    iconBg: "bg-destructive/15",
    iconColor: "text-destructive",
    getValue: (s: AdminStats) => s.inactiveUsers,
    getTrend: (s: AdminStats) => `${Math.round((s.inactiveUsers / Math.max(s.totalUsers, 1)) * 100)}% of total`,
  },
  {
    key: "totalManagers",
    label: "Managers",
    icon: Shield,
    gradient: "from-chart-2/15 to-chart-2/5",
    iconBg: "bg-chart-2/15",
    iconColor: "text-chart-2",
    getValue: (s: AdminStats) => s.totalManagers,
    getTrend: () => null,
  },
  {
    key: "totalSupervisors",
    label: "Supervisors",
    icon: Eye,
    gradient: "from-chart-3/15 to-chart-3/5",
    iconBg: "bg-chart-3/15",
    iconColor: "text-chart-3",
    getValue: (s: AdminStats) => s.totalSupervisors,
    getTrend: () => null,
  },
  {
    key: "totalEnrollments",
    label: "Total Enrollments",
    icon: Award,
    gradient: "from-chart-1/15 to-chart-1/5",
    iconBg: "bg-chart-1/15",
    iconColor: "text-chart-1",
    getValue: (s: AdminStats) => s.totalEnrollments,
    getTrend: () => null,
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6">
      {cards.map((card) => {
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
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400`}>
                    <TrendingUp className="size-2.5" /> {trend}
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