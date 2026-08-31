import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSupervisors,
  createSupervisor,
  updateSupervisor,
  changeSupervisorPassword,
  deleteSupervisor,
  updateSupervisorStatus,
} from "@/features/supervisors/api/supervisors.api";
import type { SupervisorQueryParams, CreateSupervisorInput, UpdateSupervisorInput } from "@/features/supervisors/types";

export function useSupervisors(params: SupervisorQueryParams = {}) {
  return useQuery({
    queryKey: ["supervisors", params],
    queryFn: () => getSupervisors(params),
    staleTime: 30_000,
  });
}

export function useCreateSupervisor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupervisorInput) => createSupervisor(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      toast.success(response.message || "Supervisor created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create supervisor");
    },
  });
}

export function useUpdateSupervisor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupervisorInput }) => updateSupervisor(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      toast.success(response.message || "Supervisor updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update supervisor");
    },
  });
}

export function useChangeSupervisorPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => changeSupervisorPassword(id, password),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      toast.success(response.message || "Password updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update password");
    },
  });
}

export function useDeleteSupervisor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSupervisor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      toast.success("Supervisor deleted successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to delete supervisor");
    },
  });
}

export function useUpdateSupervisorStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => updateSupervisorStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      toast.success("Supervisor status updated");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update status");
    },
  });
}
