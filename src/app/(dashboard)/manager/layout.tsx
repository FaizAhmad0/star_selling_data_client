"use client";

import { DashboardLayoutWrapper } from "@/components/dashboard/dashboard-layout";
import { managerNavItems } from "@/components/dashboard/dashboard-sidebar";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper navItems={managerNavItems}>
      {children}
    </DashboardLayoutWrapper>
  );
}
