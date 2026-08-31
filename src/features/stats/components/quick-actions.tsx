"use client";

import { useRouter } from "next/navigation";
import { UserPlus, Upload, Shield, Layers, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const actions = [
  {
    label: "Add New User",
    description: "Create a single user account",
    icon: UserPlus,
    href: "/admin/users",
    gradient: "from-chart-4/10 to-chart-4/5",
    iconBg: "bg-chart-4/15",
    iconColor: "text-chart-4",
  },
  {
    label: "Bulk Upload",
    description: "Import users from Excel",
    icon: Upload,
    href: "/admin/users",
    gradient: "from-chart-2/10 to-chart-2/5",
    iconBg: "bg-chart-2/15",
    iconColor: "text-chart-2",
  },
  {
    label: "Add Manager",
    description: "Onboard a new manager",
    icon: Shield,
    href: "/admin/managers",
    gradient: "from-chart-3/10 to-chart-3/5",
    iconBg: "bg-chart-3/15",
    iconColor: "text-chart-3",
  },
  {
    label: "Manage Platforms",
    description: "Configure marketplace platforms",
    icon: Layers,
    href: "/admin/platforms",
    gradient: "from-chart-5/10 to-chart-5/5",
    iconBg: "bg-chart-5/15",
    iconColor: "text-chart-5",
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => router.push(action.href)}
                className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${action.gradient} p-3 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className={`flex size-8 items-center justify-center rounded-lg ${action.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`size-4 ${action.iconColor}`} />
                </div>
                <p className="mt-2 text-[11px] font-semibold text-foreground">{action.label}</p>
                <p className="text-[9px] text-muted-foreground">{action.description}</p>
                <ArrowUpRight className="absolute right-2 top-2 size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
