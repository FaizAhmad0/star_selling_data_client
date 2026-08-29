"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  className?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  className,
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-12", className)}>
      <AlertCircle className="size-10 text-destructive" />
      <div className="text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}
