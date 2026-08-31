import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  bulkCreateUsers,
} from "@/features/users/api/users.api";
import type { UserQueryParams, CreateUserInput, UpdateUserInput } from "@/features/users/types";

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

export function useBulkCreateUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput[]) => bulkCreateUsers(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const { created, updated, skipped } = response.data;
      const parts: string[] = [];
      if (created.length) parts.push(`${created.length} created`);
      if (updated.length) parts.push(`${updated.length} updated`);
      if (skipped.length) parts.push(`${skipped.length} skipped`);
      toast.success(`Bulk upload completed: ${parts.join(", ")}`);
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
