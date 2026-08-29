"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { Loading } from "@/components/shared/loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}
