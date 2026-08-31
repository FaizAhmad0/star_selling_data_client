"use client";

import {
  Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Bar, BarChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { PlatformStats } from "@/features/stats/types";

interface PlatformChartsProps {
  data: PlatformStats;
  platform: "amazon" | "website" | "etsy";
}

const PLATFORM_COLORS = {
  amazon: { main: "var(--chart-4)", bg: "bg-chart-4/15", text: "text-chart-4" },
  website: { main: "var(--chart-2)", bg: "bg-chart-2/15", text: "text-chart-2" },
  etsy: { main: "var(--chart-5)", bg: "bg-chart-5/15", text: "text-chart-5" },
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

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PlatformCharts({ data, platform }: PlatformChartsProps) {
  const colors = PLATFORM_COLORS[platform];
  const enrollmentField = ENROLLMENT_KEY[platform];
  const dateField = DATE_KEY[platform];
  const batchField = BATCH_KEY[platform];
  const total = data.totalCount;

  // Monthly enrollments area chart
  const monthlyData = data.monthlyEnrollments.map((m) => ({
    month: m.label,
    count: m.count,
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Monthly Enrollment Trends</CardTitle>
              <CardDescription>New enrollments over 12 months</CardDescription>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1">
              <p className="text-xs font-bold text-primary">{total}</p>
              <p className="text-[9px] text-muted-foreground">total users</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.main} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={colors.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  dx={-4}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={colors.main}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEnrollment)"
                  dot={{ r: 3, strokeWidth: 1, stroke: colors.main, fill: "var(--card)" }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: colors.main, fill: "var(--card)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "10px",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-1.5 border-t pt-3">
            <div className={`size-2 rounded-full bg-${platform}`} />
            <span className="text-[10px] text-muted-foreground">Latest: {monthlyData[monthlyData.length - 1]?.count} users</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Managers Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Managers</CardTitle>
            <CardDescription>Users per manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.usersByManager.map((m) => ({ name: m.name || "—", count: m.count }))} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Bar dataKey="count" fill={colors.main} maxBarSize={22} name="Users" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "9px" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Batches Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Batches</CardTitle>
            <CardDescription>Users per batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.usersByBatch.map((b) => ({ name: b.batch || "—", count: b.count }))} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    width={55}
                  />
                  <Bar dataKey="count" fill={colors.main} maxBarSize={20} name="Users" />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "9px" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}