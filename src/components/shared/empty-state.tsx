"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  className?: string;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  className,
  title = "No data",
  message,
  icon,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-12", className)}>
      {icon ?? <Inbox className="size-10 text-muted-foreground" />}
      <div className="text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
