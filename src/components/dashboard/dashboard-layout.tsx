"use client";

import { useEffect, useState } from "react";
import { DashboardNavbar } from "./dashboard-navbar";
import {
  DashboardSidebar,
  type SidebarNavItem,
} from "./dashboard-sidebar";
import { useLogout } from "@/features/auth/hooks/use-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: SidebarNavItem[];
}

export function DashboardLayoutWrapper({
  children,
  navItems,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    const body = document.body;
    body.style.overflow = isSidebarOpen ? "hidden" : "";

    return () => {
      body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="h-screen overflow-hidden bg-background">
      <DashboardNavbar onMenuToggle={() => setIsSidebarOpen(true)} />
      <DashboardSidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => logoutMutation.mutate()}
      />

      <div className="pt-[72px] lg:pl-[240px]">
        <main className="h-[calc(100vh-72px)] overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
