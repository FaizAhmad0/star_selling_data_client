"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { PlatformStats } from "@/features/stats/types";

interface PlatformUsersTableProps {
  data: PlatformStats;
  platform: "amazon" | "website" | "etsy";
}

const PLATFORM_COLORS = {
  amazon: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", ring: "ring-amber-500/20" },
  website: { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", ring: "ring-blue-500/20" },
  etsy: { bg: "bg-orange-500/10", text: "text-orange-700 dark:text-orange-400", ring: "ring-orange-500/20" },
};

const ENROLLMENT_KEY = {
  amazon: "enrollmentIdAmazon",
  website: "enrollmentIdWebsite",
  etsy: "enrollmentIdEtsy",
};

const DATE_KEY = {
  amazon: "dateAmazon",
  website: "dateWebsite",
  etsy: "dateEtsy",
};

const BATCH_KEY = {
  amazon: "batchAmazon",
  website: "batchWebsite",
  etsy: "batchEtsy",
};

export function PlatformUsersTable({ data, platform }: PlatformUsersTableProps) {
  const colors = PLATFORM_COLORS[platform];
  const enrollmentField = ENROLLMENT_KEY[platform];
  const dateField = DATE_KEY[platform];
  const batchField = BATCH_KEY[platform];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}>
                {platform.toUpperCase()}
              </span>
              Enrolled Users
            </CardTitle>
            <CardDescription>All users enrolled in {platform} ({data.recentUsers.length} shown)</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg bg-emerald-500/10 px-2 py-1 text-center">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{data.activeCount}</p>
              <p className="text-[9px] text-muted-foreground">Active</p>
            </div>
            <div className="rounded-lg bg-destructive/10 px-2 py-1 text-center">
              <p className="text-xs font-bold text-destructive">{data.inactiveCount}</p>
              <p className="text-[9px] text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.recentUsers.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
            No users enrolled in {platform}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Enrollment</th>
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Batch</th>
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="pb-2 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.recentUsers.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-muted/30">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${colors.bg} ${colors.text}`}>
                          {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-xs font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-[11px] text-muted-foreground">{user.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}>
                        {String(user[enrollmentField] || "—")}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-[11px] text-muted-foreground">{String(user[batchField] || "—")}</td>
                    <td className="py-2.5 pr-4 text-[11px] text-muted-foreground">{String(user[dateField] || "—")}</td>
                    <td className="py-2.5 text-[11px] text-muted-foreground">{user.primaryContact || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
