"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AdminStats } from "@/features/stats/types";

interface UserGrowthChartProps {
  data: AdminStats["monthlyGrowth"];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-xl">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{payload[0].value} <span className="text-[10px] font-normal text-muted-foreground">users</span></p>
    </div>
  );
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const latest = data.length > 0 ? data[data.length - 1].count : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over 12 months</CardDescription>
          </div>
          <div className="text-right">
            <p className="font-heading text-lg font-bold">{total}</p>
            <p className="text-[10px] text-muted-foreground">total this year</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
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
                stroke="var(--chart-4)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorGrowth)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--chart-4)", fill: "var(--card)" }}
              />
              <CustomTooltip />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t pt-3">
          <div className="size-2 rounded-full bg-chart-4" />
          <span className="text-[10px] text-muted-foreground">Latest month: <span className="font-medium text-foreground">{latest} users</span></span>
        </div>
      </CardContent>
    </Card>
  );
}
