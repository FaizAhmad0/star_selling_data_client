"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupervisorPage() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Supervisor Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Welcome,</p>
            <p className="text-lg font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">UID: {user?.uid}</p>
            <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
            <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
