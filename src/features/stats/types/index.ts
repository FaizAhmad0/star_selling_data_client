export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalManagers: number;
  totalSupervisors: number;
  totalEnrollments: number;
  monthlyGrowthPercent: number;
  usersByPlatform: {
    amazon: number;
    website: number;
    etsy: number;
  };
  usersByManager: { name: string; count: number }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    enrollmentIdAmazon?: string;
    enrollmentIdWebsite?: string;
    enrollmentIdEtsy?: string;
    createdAt: string;
  }[];
  monthlyGrowth: { month: string; label: string; count: number }[];
  enrollmentsByMonth: { month: string; label: string; amazon: number; website: number; etsy: number }[];
}

export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: AdminStats;
}

export interface PlatformStats {
  platform: string;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  usersByManager: { name: string; count: number }[];
  usersByBatch: { batch: string; count: number }[];
  monthlyEnrollments: { month: string; label: string; count: number }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    primaryContact?: string;
    createdAt: string;
    [key: string]: unknown;
  }[];
}

export interface PlatformStatsResponse {
  success: boolean;
  message: string;
  data: PlatformStats;
}
