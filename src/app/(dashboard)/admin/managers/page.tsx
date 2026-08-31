"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Search, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useManagers } from "@/features/managers/hooks/use-managers";
import { AddManagerModal } from "@/features/managers/components/add-manager-modal";
import { ManagersTable } from "@/features/managers/components/managers-data-table";
import { FilterPopover } from "@/features/managers/components/managers-filter";

export default function AdminManagersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const limit = 10;

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setPage(1);
  }, []);

  const { data, isLoading, isError, refetch } = useManagers({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: (activeFilters.status as "active" | "inactive") || undefined,
  });

  const managers = data?.data?.data ?? [];
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
            Failed to load managers
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
              Managers
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage manager accounts, assignments, and access permissions.
          </p>
        </div>
        <Button size="default" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-1 size-3.5" />
          Add New Manager
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
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

      <ManagersTable
        managers={managers}
        meta={meta}
        isLoading={isLoading}
        onPageChange={setPage}
      />

      <AddManagerModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
