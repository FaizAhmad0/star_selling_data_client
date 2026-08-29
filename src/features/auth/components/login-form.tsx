"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "../schemas/login.schema";

interface LoginFormProps {
  onSubmit: (data: LoginInput) => void;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="uid">UID</Label>
        <div className="flex">
          <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm font-medium text-muted-foreground">
            UID
          </span>
          <Input
            id="uid"
            placeholder="1"
            className="rounded-l-none"
            disabled={isLoading}
            {...register("uid", {
              setValueAs: (value) => {
                if (!value) return value;
                const clean = value.replace(/[^0-9]/g, "");
                return clean ? `UID${clean}` : "";
              },
            })}
          />
        </div>
        {errors.uid && <p className="text-sm text-destructive">{errors.uid.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
