import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  bulkCreateUsers,
} from "@/features/users/api/users.api";
import type { UserQueryParams, CreateUserInput, UpdateUserInput, BulkUploadResult } from "@/features/users/types";

export function useUsers(params: UserQueryParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message || "User created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create user");
    },
  });
}

function downloadBulkUploadReport(result: BulkUploadResult, failedValidations: { row: number; reason: string }[]) {
  const workbook = XLSX.utils.book_new();

  if (result.skipped.length > 0) {
    const skippedData = result.skipped.map((s) => ({
      Enrollment: s.enrollment,
      "Primary Contact": s.primaryContact,
      Reason: s.reason,
    }));
    const sheet = XLSX.utils.json_to_sheet(skippedData);
    XLSX.utils.book_append_sheet(workbook, sheet, "Skipped");
  }

  if (failedValidations.length > 0) {
    const failedData = failedValidations.map((f) => ({
      Row: f.row > 0 ? `Row ${f.row}` : "Header/File",
      Reason: f.reason,
    }));
    const sheet = XLSX.utils.json_to_sheet(failedData);
    XLSX.utils.book_append_sheet(workbook, sheet, "Failed Enrollments");
  }

  if (workbook.SheetNames.length === 0) return;

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bulk-upload-report.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useBulkCreateUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, failedValidations }: { data: CreateUserInput[]; failedValidations: { row: number; reason: string }[] }) =>
      bulkCreateUsers(data).then((response) => ({ ...response, failedValidations })),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const { created, updated, skipped } = response.data;
      const parts: string[] = [];
      if (created.length) parts.push(`${created.length} created`);
      if (updated.length) parts.push(`${updated.length} updated`);
      if (skipped.length) parts.push(`${skipped.length} skipped`);
      toast.success(`Bulk upload completed: ${parts.join(", ")}`);

      if (skipped.length > 0 || response.failedValidations.length > 0) {
        downloadBulkUploadReport(response.data, response.failedValidations);
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to upload users");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => updateUser(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message || "User updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update user");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
}
