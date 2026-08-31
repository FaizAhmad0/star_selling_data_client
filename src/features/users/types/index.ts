export interface ManagerRef {
  _id: string;
  name: string;
  email: string;
}

export interface User {
  _id: string;
  uid: number;
  name: string;
  email: string;
  primaryContact?: string;
  gst?: string;
  role: "user";
  amazonManager?: ManagerRef | string;
  websiteManager?: ManagerRef | string;
  etsyManager?: ManagerRef | string;
  enrollmentIdAmazon?: string;
  enrollmentIdWebsite?: string;
  enrollmentIdEtsy?: string;
  batchAmazon?: string;
  batchWebsite?: string;
  batchEtsy?: string;
  dateAmazon?: string;
  dateWebsite?: string;
  dateEtsy?: string;
  enrolledBy?: string;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserSingleResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface CreateUserInput {
  name: string;
  email: string;
  enrollment: string;
  primaryContact: string;
  date: string;
  batch: string;
  manager: string;
  enrolledBy?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  primaryContact?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  manager?: string;
  batch?: string;
  status?: "active" | "inactive";
  joiningDate?: string;
}

export interface BulkUploadResult {
  created: User[];
  updated: User[];
  skipped: { enrollment: string; primaryContact: string; reason: string }[];
}
