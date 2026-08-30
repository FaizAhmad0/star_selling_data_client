"use client";

import { DashboardLayoutWrapper } from "@/components/dashboard/dashboard-layout";
import { accountantNavItems } from "@/components/dashboard/dashboard-sidebar";

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper navItems={accountantNavItems}>
      {children}
    </DashboardLayoutWrapper>
  );
}
