"use client";

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AdminStats } from "@/features/stats/types";

interface PlatformDistributionChartProps {
  data: AdminStats["usersByPlatform"];
}

const SEGMENTS = [
  { key: "amazon", label: "Amazon", color: "var(--chart-4)" },
  { key: "website", label: "Website", color: "var(--chart-2)" },
  { key: "etsy", label: "Etsy", color: "var(--chart-5)" },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percent: number } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-xl">
      <p className="text-[10px] font-medium text-muted-foreground">{payload[0].name}</p>
      <p className="mt-0.5 text-sm font-bold text-foreground">{payload[0].value} <span className="text-[10px] font-normal text-muted-foreground">users ({(payload[0].payload.percent * 100).toFixed(0)}%)</span></p>
    </div>
  );
}

export function PlatformDistributionChart({ data }: PlatformDistributionChartProps) {
  const chartData = SEGMENTS
    .map((s) => ({ name: s.label, value: data[s.key as keyof typeof data], color: s.color }))
    .filter((d) => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>Users across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-xs text-muted-foreground">
            No enrollment data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const dataWithPercent = chartData.map((d) => ({ ...d, percent: total > 0 ? d.value / total : 0 }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Users across platforms</CardDescription>
          </div>
          <p className="font-heading text-lg font-bold">{total}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {dataWithPercent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <CustomTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex w-full flex-col gap-2">
            {dataWithPercent.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{d.value}</span>
                  <span className="text-[10px] text-muted-foreground">({(d.percent * 100).toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
