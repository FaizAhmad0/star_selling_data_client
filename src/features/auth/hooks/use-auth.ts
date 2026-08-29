import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser, verifyOtp, logoutUser, getCurrentUser } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthUser } from "@/features/auth/types";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ uid, password }: { uid: string; password: string }) =>
      loginUser(uid, password),
    onSuccess: (response) => {
      if (response.requiresOtp) {
        return { requiresOtp: true as const, uid: response.data.uid };
      }
      setUser(response.data);
      redirectByRole(response.data.role, router);
      toast.success(response.message);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ uid, otp }: { uid: string; otp: string }) => verifyOtp(uid, otp),
    onSuccess: (response) => {
      setUser(response.data);
      redirectByRole(response.data.role, router);
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

function redirectByRole(role: string, router: ReturnType<typeof useRouter>) {
  switch (role) {
    case "admin":
      router.push("/admin");
      break;
    case "manager":
      router.push("/manager");
      break;
    case "accountant":
      router.push("/accountant");
      break;
    case "supervisor":
      router.push("/supervisor");
      break;
    default:
      router.push("/dashboard");
      break;
  }
}
