import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser, verifyOtp, logoutUser, getCurrentUser } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthUser } from "@/features/auth/types";

export function useLogin() {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ uid, password }: { uid: string; password: string }) =>
      loginUser(uid, password),
    onSuccess: (response) => {
      if ("role" in response.data) {
        setUser(response.data);
        toast.success(response.message);
      }
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });
}

export function useVerifyOtp() {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ uid, otp }: { uid: string; otp: string }) => verifyOtp(uid, otp),
    onSuccess: (response) => {
      setUser(response.data);
      toast.success(response.message);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });
}

export function useCurrentUser() {
  const { setUser, clearAuth } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await getCurrentUser();
      setUser(response.data);
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: () => {
        clearAuth();
      },
    },
  });
}
