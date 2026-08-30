"use client";

import { DashboardLayoutWrapper } from "@/components/dashboard/dashboard-layout";
import { supervisorNavItems } from "@/components/dashboard/dashboard-sidebar";

export default function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper navItems={supervisorNavItems}>
      {children}
    </DashboardLayoutWrapper>
  );
}
