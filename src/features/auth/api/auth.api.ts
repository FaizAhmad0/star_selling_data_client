import { apiPost, apiGet } from "@/lib/axios";
import type { LoginResponse, OtpResponse, AuthUser } from "@/features/auth/types";

export async function loginUser(uid: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/auth/login", { uid, password });
}

export async function verifyOtp(uid: string, otp: string): Promise<OtpResponse> {
  return apiPost<OtpResponse>("/auth/verify-otp", { uid, otp });
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  return apiPost<{ success: boolean; message: string }>("/auth/logout");
}

export async function getCurrentUser(): Promise<{ success: boolean; message: string; data: AuthUser }> {
  return apiGet<{ success: boolean; message: string; data: AuthUser }>("/auth/me");
}
