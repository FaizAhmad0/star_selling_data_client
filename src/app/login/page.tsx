"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useLogin, useVerifyOtp } from "@/features/auth/hooks/use-auth";
import { LoginForm } from "@/features/auth/components/login-form";
import { OtpForm } from "@/features/auth/components/otp-form";
import type { LoginInput } from "@/features/auth/schemas/login.schema";
import type { OtpInput } from "@/features/auth/schemas/otp.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import Image from "next/image";

function redirectByRole(role: string, router: ReturnType<typeof useRouter>) {
  switch (role) {
    case "admin":
      router.push("/admin");
      break;
    case "manager":
      router.push("/manager");
      break;
    case "accountant":
      router.push("/accountant");
      break;
    case "supervisor":
      router.push("/supervisor");
      break;
    default:
      router.push("/dashboard");
      break;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [view, setView] = useState<"login" | "otp">("login");
  const [pendingUid, setPendingUid] = useState("");
  const [expiresIn, setExpiresIn] = useState(300);

  const loginMutation = useLogin();
  const otpMutation = useVerifyOtp();

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role, router);
    }
  }, [isAuthenticated, user, router]);

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
      loginMutation.mutateAsync(data).then((response) => {
        if ("requiresOtp" in response.data) {
          setPendingUid(data.uid);
          setExpiresIn(300);
          setView("otp");
        } else {
          redirectByRole(response.data.role, router);
        }
      });
    },
    [loginMutation, router],
  );

  const handleVerifyOtp = useCallback(
    (data: OtpInput) => {
      otpMutation
        .mutateAsync({ uid: pendingUid, otp: data.otp })
        .then((response) => {
          redirectByRole(response.data.role, router);
        });
    },
    [otpMutation, pendingUid, router],
  );

  const handleBackToLogin = () => {
    setView("login");
    setPendingUid("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 pb-8 ">
      <Card className="w-full max-w-sm border-border/60 py-12 px-4 shadow-lg shadow-black/5">
        <CardHeader className="items-center space-y-3 text-center">
          <Image
            src="/logo.png"
            height={64}
            width={220}
            alt="Starsellingz"
            className="mx-auto h-16 w-auto object-contain"
            priority
          />
          <div className="space-y-2">
            <CardTitle className="font-heading text-xl font-semibold tracking-tight">
              {view === "login" ? "Welcome back" : "Verify your identity"}
            </CardTitle>
            <CardDescription className="text-sm">
              {view === "login"
                ? "Sign in to your account to continue"
                : "We sent a 6-digit verification code to your email"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {/* <Separator className="mb-6" /> */}
          {view === "login" ? (
            <LoginForm
              onSubmit={handleLogin}
              isLoading={loginMutation.isPending}
            />
          ) : (
            <div className="space-y-5">
              <OtpForm
                onSubmit={handleVerifyOtp}
                isLoading={otpMutation.isPending}
                expiresIn={expiresIn}
              />
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Back to login
              </button>
            </div>
          )}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a
              href="/privacy-policy"
              className="text-foreground underline underline-offset-2 transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
