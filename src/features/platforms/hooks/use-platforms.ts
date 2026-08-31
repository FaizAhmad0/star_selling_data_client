import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
} from "@/features/platforms/api/platforms.api";
import type {
  PlatformQueryParams,
  CreatePlatformInput,
  UpdatePlatformInput,
} from "@/features/platforms/types";

export function usePlatforms(params: PlatformQueryParams = {}) {
  return useQuery({
    queryKey: ["platforms", params],
    queryFn: () => getPlatforms(params),
    staleTime: 30_000,
  });
}

export function useCreatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlatformInput) => createPlatform(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      toast.success(response.message || "Platform created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create platform");
    },
  });
}

export function useUpdatePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlatformInput }) =>
      updatePlatform(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      toast.success(response.message || "Platform updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update platform");
    },
  });
}

export function useDeletePlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlatform(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] });
      toast.success("Platform deleted successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to delete platform");
    },
  });
}
