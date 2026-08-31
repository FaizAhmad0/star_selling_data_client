"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Plus, Users, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers, useDeleteUser } from "@/features/users/hooks/use-users";
import { useManagers } from "@/features/managers/hooks/use-managers";
import { AddUserModal } from "@/features/users/components/add-user-modal";
import { EditUserModal } from "@/features/users/components/edit-user-modal";
import { BulkUploadModal } from "@/features/users/components/bulk-upload-modal";
import { UsersTable } from "@/features/users/components/users-data-table";
import { UsersFilter } from "@/features/users/components/users-filter";
import type { User } from "@/features/users/types";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const manager = searchParams.get("manager") || "";
  const batch = searchParams.get("batch") || "";
  const joiningDate = searchParams.get("joiningDate") || "";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const deleteMutation = useDeleteUser();
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
    updateParams({ status: "", manager: "", batch: "", joiningDate: "", page: "1" });
  }, [updateParams]);

  const handleDownloadSample = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/testdata.xlsx";
    link.download = "testdata.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const { data: managersData, isLoading: managersLoading } = useManagers({ limit: 1000 });
  const managerOptions = (managersData?.data?.data ?? []).map((m) => ({ label: m.name, value: m.name }));

  const { data, isLoading, isError, refetch } = useUsers({
    page,
    limit,
    search: search || undefined,
    status: (status as "active" | "inactive") || undefined,
    manager: manager || undefined,
    batch: batch || undefined,
    joiningDate: joiningDate || undefined,
  });

  const users = data?.data?.data ?? [];
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
    { label: "Manager", key: "manager", type: "manager-select" as const },
    { label: "Batch", key: "batch", type: "text" as const },
    { label: "Joining Date", key: "joiningDate", type: "date" as const },
  ];

  const activeFilters: Record<string, string> = {};
  if (status) activeFilters.status = status;
  if (manager) activeFilters.manager = manager;
  if (batch) activeFilters.batch = batch;
  if (joiningDate) activeFilters.joiningDate = joiningDate;

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
            Failed to load users
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
              Users
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage user accounts, enrollments, and access permissions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadSample} className="gap-1.5">
            <Download className="size-3.5" />
            Download Sample
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsBulkUploadOpen(true)} className="gap-1.5">
            <Upload className="size-3.5" />
            Bulk Upload
          </Button>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5">
            <Plus className="size-3.5" />
            Add New User
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            key={search}
            placeholder="Search by name, email, phone, or enrollment..."
            defaultValue={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <UsersFilter
          filters={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          managerOptions={managerOptions}
          managerLoading={managersLoading}
        />
      </div>

      <UsersTable
        users={users}
        meta={meta}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onView={(user) => setEditingUser(user)}
        onEdit={(user) => setEditingUser(user)}
        onDelete={(user) => deleteMutation.mutate(user._id)}
      />

      <AddUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditUserModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      <BulkUploadModal
        open={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />
    </div>
  );
}
