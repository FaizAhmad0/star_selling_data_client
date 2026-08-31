export interface Supervisor {
  _id: string;
  uid: number;
  name: string;
  email: string;
  primaryContact?: string;
  gst?: string;
  role: "supervisor";
  createdAt: string;
  updatedAt: string;
}

export interface SupervisorListResponse {
  success: boolean;
  message: string;
  data: {
    data: Supervisor[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SupervisorSingleResponse {
  success: boolean;
  message: string;
  data: Supervisor;
}

export interface CreateSupervisorInput {
  name: string;
  email: string;
  primaryContact: string;
  password: string;
}

export interface UpdateSupervisorInput {
  name?: string;
  email?: string;
  primaryContact?: string;
}

export interface SupervisorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
}
