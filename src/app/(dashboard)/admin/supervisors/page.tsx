"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupervisors } from "@/features/supervisors/hooks/use-supervisors";
import { AddSupervisorModal } from "@/features/supervisors/components/add-supervisor-modal";
import { SupervisorsTable } from "@/features/supervisors/components/supervisors-data-table";
import { FilterPopover } from "@/features/supervisors/components/supervisors-filter";

export default function AdminSupervisorsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const limit = 10;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        updateParams({ search: value, page: "1" });
      }, 400);
    },
    [updateParams]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateParams({ page: String(newPage) });
    },
    [updateParams]
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      updateParams({ [key]: value, page: "1" });
    },
    [updateParams]
  );

  const handleClearFilters = useCallback(() => {
    updateParams({ status: "", page: "1" });
  }, [updateParams]);

  const { data, isLoading, isError, refetch } = useSupervisors({
    page,
    limit,
    search: search || undefined,
    status: (status as "active" | "inactive") || undefined,
  });

  const supervisors = data?.data?.data ?? [];
  const meta = data?.data?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  const filterGroups = [
    {
      label: "Status",
      key: "status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const activeFilters: Record<string, string> = {};
  if (status) activeFilters.status = status;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="size-6 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Failed to load supervisors
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please check your connection and try again.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-4 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-semibold text-foreground">
              Supervisors
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage supervisor accounts, assignments, and access permissions.
          </p>
        </div>
        <Button size="default" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-1 size-3.5" />
          Add New Supervisor
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            key={search}
            placeholder="Search by name, email, or phone..."
            defaultValue={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <FilterPopover
          filters={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      <SupervisorsTable
        supervisors={supervisors}
        meta={meta}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />

      <AddSupervisorModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
