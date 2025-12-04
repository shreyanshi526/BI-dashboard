import CoreAPIService from '@/utils/CoreAPIService';

// Types
export interface DashboardSummary {
  totalTransactions: number;
  totalTokens: number;
  totalCost: number;
  activeUsers: number;
  totalUsers: number;
  proUsers: number;
  totalConversations: number;
  avgCostPerConversation: number;
}

export interface CostByModel {
  model: string;
  cost: number;
  tokens: number;
  transactions: number;
}

export interface UsageByRegion {
  region: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export interface DailyTrend {
  date: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export interface MonthlyTrend {
  month: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export interface UsageByDepartment {
  department: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export interface TokenDistribution {
  type: string;
  tokens: number;
  cost: number;
}

export interface TopUser {
  userName: string;
  company: string;
  department: string;
  region: string;
  isProUser: boolean;
  cost: number;
  tokens: number;
  transactions: number;
}

export interface UsageByCompany {
  company: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export interface DateRange {
  minDate: string;
  maxDate: string;
}

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  region?: string;
}

// API Base URL
const API_BASE = '/api/dashboard';

// Create API instance
const apiService = new CoreAPIService(API_BASE);

// Helper to build query params
const buildQueryParams = (params: FilterParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  if (params.startDate) queryParams.startDate = params.startDate;
  if (params.endDate) queryParams.endDate = params.endDate;
  if (params.region && params.region !== 'all') queryParams.region = params.region;
  return queryParams;
};

// Dashboard Service
export const dashboardService = {
  getSummary: (params: FilterParams = {}): Promise<DashboardSummary> => {
    return apiService.get<DashboardSummary>('/summary', buildQueryParams(params));
  },

  getCostByModel: (params: FilterParams = {}): Promise<CostByModel[]> => {
    return apiService.get<CostByModel[]>('/cost-by-model', buildQueryParams(params));
  },

  getUsageByRegion: (params: FilterParams = {}): Promise<UsageByRegion[]> => {
    return apiService.get<UsageByRegion[]>('/usage-by-region', buildQueryParams(params));
  },

  getDailyTrends: (params: FilterParams = {}): Promise<DailyTrend[]> => {
    return apiService.get<DailyTrend[]>('/daily-trends', buildQueryParams(params));
  },

  getMonthlyTrends: (params: FilterParams = {}): Promise<MonthlyTrend[]> => {
    return apiService.get<MonthlyTrend[]>('/monthly-trends', buildQueryParams(params));
  },

  getUsageByDepartment: (params: FilterParams = {}): Promise<UsageByDepartment[]> => {
    return apiService.get<UsageByDepartment[]>('/usage-by-department', buildQueryParams(params));
  },

  getTokenDistribution: (params: FilterParams = {}): Promise<TokenDistribution[]> => {
    return apiService.get<TokenDistribution[]>('/token-distribution', buildQueryParams(params));
  },

  getTopUsers: (params: FilterParams = {}, limit: number = 10): Promise<TopUser[]> => {
    return apiService.get<TopUser[]>('/top-users', { ...buildQueryParams(params), limit: String(limit) });
  },

  getUsageByCompany: (params: FilterParams = {}): Promise<UsageByCompany[]> => {
    return apiService.get<UsageByCompany[]>('/usage-by-company', buildQueryParams(params));
  },

  getRegions: (): Promise<string[]> => {
    return apiService.get<string[]>('/regions');
  },

  getDateRange: (): Promise<DateRange> => {
    return apiService.get<DateRange>('/date-range');
  },
};

export default dashboardService;

