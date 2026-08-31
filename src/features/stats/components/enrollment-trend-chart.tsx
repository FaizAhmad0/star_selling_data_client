"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AdminStats } from "@/features/stats/types";

interface EnrollmentTrendChartProps {
  data: AdminStats["enrollmentsByMonth"];
}

const PLATFORMS = [
  { key: "amazon" as const, label: "Amazon", color: "var(--chart-4)" },
  { key: "website" as const, label: "Website", color: "var(--chart-2)" },
  { key: "etsy" as const, label: "Etsy", color: "var(--chart-5)" },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2.5 shadow-xl">
      <p className="mb-1.5 text-[10px] font-medium text-muted-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="size-1.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-[10px] text-muted-foreground">{p.name}</span>
            <span className="ml-auto text-[10px] font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EnrollmentTrendChart({ data }: EnrollmentTrendChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Platform enrollments over 12 months</CardDescription>
          </div>
          <div className="flex gap-3">
            {PLATFORMS.map((p) => (
              <div key={p.key} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[10px] text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              {PLATFORMS.map((p) => (
                <Line
                  key={p.key}
                  type="monotone"
                  dataKey={p.key}
                  stroke={p.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: p.color, fill: "var(--card)" }}
                  name={p.label}
                />
              ))}
              <CustomTooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
