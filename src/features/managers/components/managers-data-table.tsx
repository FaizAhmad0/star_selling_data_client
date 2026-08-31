"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteManager } from "@/features/managers/hooks/use-managers";
import type { Manager } from "@/features/managers/types";

interface ManagersTableProps {
  managers: Manager[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

function ManagerRowSkeleton() {
  return (
    <tr className="border-b border-border transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-36 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <div className="h-3 w-14 animate-pulse rounded bg-muted" />
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <div className="size-7 animate-pulse rounded bg-muted" />
        </div>
      </td>
    </tr>
  );
}

function ManagerRow({
  manager,
  onDelete,
}: {
  manager: Manager;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = manager.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const createdAt = manager.createdAt
    ? format(new Date(manager.createdAt), "MMM d, yyyy")
    : "—";

  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">
              {manager.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {manager.email}
            </p>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <p className="font-mono text-xs font-medium text-foreground">
          {manager.uid ? `UID${manager.uid}` : "—"}
        </p>
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <p className="text-xs text-muted-foreground">
          {manager.primaryContact || "—"}
        </p>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          Active
        </span>
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <p className="text-xs text-muted-foreground">{createdAt}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="size-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    <Eye className="size-3.5" />
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </button>
                  <div className="border-t border-border" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(manager._id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive transition-colors hover:bg-destructive/5"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export function ManagersTable({
  managers,
  meta,
  isLoading,
  onPageChange,
}: ManagersTableProps) {
  const deleteManager = useDeleteManager();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this manager? This action cannot be undone.")) {
      deleteManager.mutate(id);
    }
  };

  const pages = useMemo(() => {
    const range: (number | "...")[] = [];
    const { page, totalPages } = meta;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (page > 3) range.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (page < totalPages - 2) range.push("...");
      range.push(totalPages);
    }

    return range;
  }, [meta]);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Manager
              </th>
              <th className="hidden px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                UID
              </th>
              <th className="hidden px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Contact
              </th>
              <th className="hidden px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                Status
              </th>
              <th className="hidden px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                Created
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <ManagerRowSkeleton />
                <ManagerRowSkeleton />
                <ManagerRowSkeleton />
                <ManagerRowSkeleton />
                <ManagerRowSkeleton />
              </>
            ) : managers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <svg
                        className="size-6 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        No managers found
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Get started by adding a new manager.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              managers.map((manager) => (
                <ManagerRow
                  key={manager._id}
                  manager={manager}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta.total > 0 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-[11px] text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            managers
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onPageChange(1)}
              disabled={meta.page === 1}
            >
              <ChevronsLeft className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page === 1}
            >
              <ChevronLeft className="size-3.5" />
            </Button>

            {pages.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-xs text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={meta.page === p ? "default" : "ghost"}
                  size="icon-xs"
                  onClick={() => onPageChange(p as number)}
                  className="min-w-[28px]"
                >
                  {p}
                </Button>
              )
            )}

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
            >
              <ChevronRight className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onPageChange(meta.totalPages)}
              disabled={meta.page === meta.totalPages}
            >
              <ChevronsRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
