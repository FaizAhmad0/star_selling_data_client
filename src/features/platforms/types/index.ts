export interface Platform {
  _id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PlatformListResponse {
  success: boolean;
  message: string;
  data: {
    data: Platform[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PlatformSingleResponse {
  success: boolean;
  message: string;
  data: Platform;
}

export interface CreatePlatformInput {
  name: string;
  status?: "active" | "inactive";
}

export interface UpdatePlatformInput {
  name?: string;
  status?: "active" | "inactive";
}

export interface PlatformQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
}
