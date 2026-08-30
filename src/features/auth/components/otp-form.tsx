"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { otpSchema, type OtpInput } from "../schemas/otp.schema";

interface OtpFormProps {
  onSubmit: (data: OtpInput) => void;
  isLoading: boolean;
  expiresIn: number;
}

export function OtpForm({ onSubmit, isLoading, expiresIn }: OtpFormProps) {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const updateOtp = useCallback(
    (values: string[]) => {
      const otp = values.join("");
      setValue("otp", otp, { shouldValidate: otp.length === 6 });
    },
    [setValue],
  );

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    updateOtp(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newValues = [...otpValues];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setOtpValues(newValues);
    updateOtp(newValues);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const minutes = Math.floor(expiresIn / 60);
  const seconds = expiresIn % 60;
  const isExpired = expiresIn <= 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-center gap-2.5 sm:gap-3">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-12 w-11 text-center text-lg font-semibold sm:h-14 sm:w-12 sm:text-xl"
              disabled={isLoading}
            />
          ))}
        </div>
        {errors.otp && (
          <p className="text-center text-sm text-destructive">
            {errors.otp.message}
          </p>
        )}
      </div>

      <div className="text-center">
        {isExpired ? (
          <p className="text-sm text-destructive">
            Code has expired. Please sign in again.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Code expires in{" "}
            <span
              className={`font-medium tabular-nums ${
                expiresIn <= 60 ? "text-destructive" : "text-foreground"
              }`}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-10 w-full text-sm font-medium"
        disabled={isLoading || isExpired}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </form>
  );
}
