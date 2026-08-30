"use client";

import { DashboardLayoutWrapper } from "@/components/dashboard/dashboard-layout";
import { adminNavItems } from "@/components/dashboard/dashboard-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper navItems={adminNavItems}>
      {children}
    </DashboardLayoutWrapper>
  );
}
