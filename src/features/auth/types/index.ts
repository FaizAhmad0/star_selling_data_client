export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  uid: number;
  role: "user" | "manager" | "admin" | "supervisor" | "accountant";
  enrollmentIdAmazon?: string;
  enrollmentIdWebsite?: string;
  enrollmentIdEtsy?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthUser | { requiresOtp: true; uid: number };
}

export interface OtpResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}
