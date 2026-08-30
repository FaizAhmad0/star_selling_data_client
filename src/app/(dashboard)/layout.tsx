"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { Loading } from "@/components/shared/loading";

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  manager: ["/manager"],
  supervisor: ["/supervisor"],
  accountant: ["/accountant"],
  user: ["/dashboard"],
};

const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  supervisor: "/supervisor",
  accountant: "/accountant",
  user: "/dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      const allowedRoutes = ROLE_ROUTES[user.role] ?? ["/dashboard"];
      const isAllowed = allowedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
      );

      if (!isAllowed) {
        const dashboard = ROLE_DASHBOARD[user.role] ?? "/dashboard";
        router.push(dashboard);
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const allowedRoutes = ROLE_ROUTES[user.role] ?? ["/dashboard"];
  const isAllowed = allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!isAllowed) {
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}
