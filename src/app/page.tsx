"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { Loading } from "@/components/shared/loading";

const ROLE_DASHBOARD: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  supervisor: "/supervisor",
  accountant: "/accountant",
  user: "/dashboard",
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      const dashboard = ROLE_DASHBOARD[user.role] ?? "/dashboard";
      router.push(dashboard);
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading text="Loading..." />
    </div>
  );
}
