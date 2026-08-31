import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getManagers,
  createManager,
  updateManager,
  changeManagerPassword,
  deleteManager,
  updateManagerStatus,
} from "@/features/managers/api/managers.api";
import type {
  ManagerQueryParams,
  CreateManagerInput,
  UpdateManagerInput,
} from "@/features/managers/types";

export function useManagers(params: ManagerQueryParams = {}) {
  return useQuery({
    queryKey: ["managers", params],
    queryFn: () => getManagers(params),
    staleTime: 30_000,
  });
}

export function useCreateManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateManagerInput) => createManager(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      toast.success(response.message || "Manager created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create manager");
    },
  });
}

export function useUpdateManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateManagerInput }) =>
      updateManager(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      toast.success(response.message || "Manager updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update manager");
    },
  });
}

export function useChangeManagerPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      changeManagerPassword(id, password),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      toast.success(response.message || "Password updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update password");
    },
  });
}

export function useDeleteManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      toast.success("Manager deleted successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to delete manager");
    },
  });
}

export function useUpdateManagerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateManagerStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      toast.success("Manager status updated");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update status");
    },
  });
}
