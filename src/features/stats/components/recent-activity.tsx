"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AdminStats } from "@/features/stats/types";

interface RecentActivityProps {
  users: AdminStats["recentUsers"];
}

function getPlatformInfo(user: AdminStats["recentUsers"][0]) {
  if (user.enrollmentIdAmazon) return { label: "Amazon", abbr: "AZ", color: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400" };
  if (user.enrollmentIdWebsite) return { label: "Website", abbr: "WB", color: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-400" };
  if (user.enrollmentIdEtsy) return { label: "Etsy", abbr: "ET", color: "bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-400" };
  return { label: "N/A", abbr: "—", color: "bg-muted text-muted-foreground ring-border" };
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-chart-4/15 text-chart-4",
  "bg-chart-2/15 text-chart-2",
  "bg-chart-3/15 text-chart-3",
  "bg-chart-5/15 text-chart-5",
  "bg-chart-1/15 text-chart-1",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function RecentActivity({ users }: RecentActivityProps) {
  const router = useRouter();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-[10px] text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/admin/users")}
          >
            View all <ArrowRight className="size-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user, idx) => {
              const platform = getPlatformInfo(user);
              return (
                <div
                  key={user._id}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="relative">
                    <div className={`flex size-9 items-center justify-center rounded-full text-[10px] font-semibold ${getAvatarColor(user.name)}`}>
                      {getInitials(user.name)}
                    </div>
                    {idx < 3 && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium group-hover:text-foreground">{user.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${platform.color}`}>
                    {platform.abbr}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
