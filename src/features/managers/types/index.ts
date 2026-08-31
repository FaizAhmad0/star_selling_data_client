export interface Manager {
  _id: string;
  uid: number;
  name: string;
  email: string;
  primaryContact?: string;
  gst?: string;
  role: "manager";
  createdAt: string;
  updatedAt: string;
}

export interface ManagerListResponse {
  success: boolean;
  message: string;
  data: {
    data: Manager[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ManagerSingleResponse {
  success: boolean;
  message: string;
  data: Manager;
}

export interface CreateManagerInput {
  name: string;
  email: string;
  primaryContact: string;
  password: string;
}

export interface UpdateManagerInput {
  name?: string;
  email?: string;
  primaryContact?: string;
}

export interface ManagerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
}
