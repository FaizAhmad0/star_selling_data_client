"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Users, Layers, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  items: SidebarNavItem[];
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function isActivePath(pathname: string, href: string) {
  if (href.split("/").length === 2) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
  items,
  isOpen,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition duration-300 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed left-0 top-18 z-50 flex h-[calc(100vh-72px)] w-[240px] flex-col border-r border-sidebar-border bg-background/95 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground shadow-sm transition hover:text-foreground lg:hidden"
          aria-label="Close sidebar menu"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-sidebar-border px-5 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
            Navigation
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-0 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 px-5 py-[11px] text-[11px] font-semibold uppercase tracking-[0.1em] transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-foreground/80 hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-3 left-0 w-[3px] rounded-r-full transition",
                    active ? "bg-sidebar-primary" : "bg-transparent",
                  )}
                />
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export const adminNavItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Managers", href: "/admin/managers", icon: Users },
  { label: "Supervisors", href: "/admin/supervisors", icon: Users },
  { label: "Platforms", href: "/admin/platforms", icon: Layers },
];

export const managerNavItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/manager", icon: LayoutDashboard },
  { label: "Users", href: "/manager/users", icon: Users },
];

export const supervisorNavItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/supervisor", icon: LayoutDashboard },
  { label: "Users", href: "/supervisor/users", icon: Users },
];

export const accountantNavItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/accountant", icon: LayoutDashboard },
  { label: "Users", href: "/accountant/users", icon: Users },
];
