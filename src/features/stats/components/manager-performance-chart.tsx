"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AdminStats } from "@/features/stats/types";

interface ManagerPerformanceChartProps {
  data: AdminStats["usersByManager"];
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

export function ManagerPerformanceChart({ data }: ManagerPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Manager Performance</CardTitle>
          <CardDescription>Top managers by user count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-xs text-muted-foreground">
            No manager data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [...data].reverse();
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Manager Performance</CardTitle>
            <CardDescription>Top managers by user count</CardDescription>
          </div>
          <div className="rounded-lg bg-chart-2/10 px-2 py-1">
            <p className="text-xs font-bold text-chart-2">{data.length}</p>
            <p className="text-[9px] text-muted-foreground">managers</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
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
                width={90}
              />
              <Bar
                dataKey="count"
                radius={[0, 6, 6, 0]}
                maxBarSize={24}
                animationDuration={800}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill="var(--chart-2)"
                    fillOpacity={entry.count === maxCount ? 1 : 0.5}
                  />
                ))}
              </Bar>
              <CustomTooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
