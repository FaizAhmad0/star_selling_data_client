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
import { motion, AnimatePresence } from "motion/react";
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
    <div className="relative flex min-h-screen items-center justify-center bg-muted/30 px-4 pb-8 overflow-hidden">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="200" cy="150" r="300" fill="url(#g1)" />
        <circle cx="1200" cy="700" r="350" fill="url(#g2)" />
        <circle cx="700" cy="450" r="200" fill="url(#g3)" />
        <path
          d="M0 600 Q360 500 720 650 T1440 550"
          stroke="currentColor"
          className="text-primary/20"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0 650 Q360 550 720 700 T1440 600"
          stroke="currentColor"
          className="text-primary/10"
          strokeWidth="1"
          fill="none"
        />
        <defs>
          <radialGradient id="g1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 150) scale(300)">
            <stop stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1200 700) scale(350)">
            <stop stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(700 450) scale(200)">
            <stop stopColor="hsl(var(--accent))" stopOpacity="0.12" />
            <stop offset="1" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <Card className="w-full border-border/60 py-12 px-4 shadow-lg shadow-black/5 backdrop-blur-sm">
          <CardHeader className="items-center space-y-3 text-center">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Image
                src="/logo.png"
                height={64}
                width={220}
                alt="Starsellingz"
                className="mx-auto h-16 w-auto object-contain"
                priority
              />
            </motion.div>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                {view === "login" ? "Welcome back" : "Verify your identity"}
              </CardTitle>
              <CardDescription className="text-sm">
                {view === "login"
                  ? "Sign in to your account to continue"
                  : "We sent a 6-digit verification code to your email"}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-2">
            <AnimatePresence mode="wait">
              {view === "login" ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm
                    onSubmit={handleLogin}
                    isLoading={loginMutation.isPending}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="otp-form"
                  className="space-y-5"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <OtpForm
                    onSubmit={handleVerifyOtp}
                    isLoading={otpMutation.isPending}
                    expiresIn={expiresIn}
                  />
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full cursor-pointer text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Back to login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a
                href="/privacy-policy"
                className="cursor-pointer text-foreground underline underline-offset-2 transition-colors hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
