"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useLogin, useVerifyOtp } from "@/features/auth/hooks/use-auth";
import { LoginForm } from "@/features/auth/components/login-form";
import { OtpForm } from "@/features/auth/components/otp-form";
import type { LoginInput } from "@/features/auth/schemas/login.schema";
import type { OtpInput } from "@/features/auth/schemas/otp.schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [view, setView] = useState<"login" | "otp">("login");
  const [pendingUid, setPendingUid] = useState("");
  const [expiresIn, setExpiresIn] = useState(300);

  const loginMutation = useLogin();
  const otpMutation = useVerifyOtp();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (view !== "otp") return;
    if (expiresIn <= 0) return;

    const timer = setInterval(() => {
      setExpiresIn((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [view, expiresIn]);

  const handleLogin = useCallback(
    (data: LoginInput) => {
      loginMutation.mutate(data, {
        onSuccess: (response) => {
          if (response.requiresOtp) {
            setPendingUid(data.uid);
            setExpiresIn(300);
            setView("otp");
          }
        },
      });
    },
    [loginMutation],
  );

  const handleVerifyOtp = useCallback(
    (data: OtpInput) => {
      otpMutation.mutate({ uid: pendingUid, otp: data.otp });
    },
    [otpMutation, pendingUid],
  );

  const handleBackToLogin = () => {
    setView("login");
    setPendingUid("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {view === "login" ? "Welcome back" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {view === "login"
              ? "Enter your UID and password to sign in"
              : `We sent a 6-digit code to your email`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          {view === "login" ? (
            <LoginForm onSubmit={handleLogin} isLoading={loginMutation.isPending} />
          ) : (
            <div className="space-y-4">
              <OtpForm
                onSubmit={handleVerifyOtp}
                isLoading={otpMutation.isPending}
                expiresIn={expiresIn}
              />
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Back to login
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
