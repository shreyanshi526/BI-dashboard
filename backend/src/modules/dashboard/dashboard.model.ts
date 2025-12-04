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

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
  region?: string;
  limit?: number;
}

