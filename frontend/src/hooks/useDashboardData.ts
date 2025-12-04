import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  dashboardService, 
  DashboardSummary, 
  CostByModel, 
  DailyTrend,
  MonthlyTrend,
  TokenDistribution,
  TopUser,
  DateRange,
  FilterParams
} from '@/services';

interface DashboardData {
  summary: DashboardSummary | null;
  costByModel: CostByModel[];
  dailyTrends: DailyTrend[];
  monthlyTrends: MonthlyTrend[];
  tokenDistribution: TokenDistribution[];
  topUsers: TopUser[];
  regions: string[];
  dateRange: DateRange | null;
}

interface LoadingStates {
  summary: boolean;
  costByModel: boolean;
  dailyTrends: boolean;
  monthlyTrends: boolean;
  tokenDistribution: boolean;
  topUsers: boolean;
  regions: boolean;
  dateRange: boolean;
}

interface UseDashboardDataReturn extends DashboardData {
  loading: boolean;
  loadings: LoadingStates;
  error: string | null;
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
  refetch: () => void;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData>({
    summary: null,
    costByModel: [],
    dailyTrends: [],
    monthlyTrends: [],
    tokenDistribution: [],
    topUsers: [],
    regions: [],
    dateRange: null,
  });

  const [loadings, setLoadings] = useState<LoadingStates>({
    summary: false,
    costByModel: false,
    dailyTrends: false,
    monthlyTrends: false,
    tokenDistribution: false,
    topUsers: false,
    regions: false,
    dateRange: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<FilterParams>({});

  const initialFetchRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchEndpoint = useCallback(<K extends keyof DashboardData>(
    key: K,
    fetchFn: () => Promise<DashboardData[K]>,
    requestId: number
  ) => {
    setLoadings((prev) => ({ ...prev, [key]: true }));

    fetchFn()
      .then((result) => {
        if (requestIdRef.current === requestId) {
          setData((prev) => ({ ...prev, [key]: result ?? (Array.isArray(prev[key]) ? [] : null) }));
        }
      })
      .catch((err) => {
        console.error(`Error fetching ${key}:`, err);
        if (requestIdRef.current === requestId) {
          setData((prev) => ({ ...prev, [key]: Array.isArray(prev[key]) ? [] : null }));
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setLoadings((prev) => ({ ...prev, [key]: false }));
        }
      });
  }, []);

  const fetchData = useCallback((currentFilters: FilterParams) => {
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;
    setError(null);

    const endpoints: Array<{ key: keyof DashboardData; fetchFn: () => Promise<any>; initialOnly?: boolean }> = [
      { key: 'summary', fetchFn: () => dashboardService.getSummary(currentFilters) },
      { key: 'costByModel', fetchFn: () => dashboardService.getCostByModel(currentFilters) },
      { key: 'dailyTrends', fetchFn: () => dashboardService.getDailyTrends(currentFilters) },
      { key: 'monthlyTrends', fetchFn: () => dashboardService.getMonthlyTrends(currentFilters) },
      { key: 'tokenDistribution', fetchFn: () => dashboardService.getTokenDistribution(currentFilters) },
      { key: 'topUsers', fetchFn: () => dashboardService.getTopUsers(currentFilters, 10) },
      { key: 'dateRange', fetchFn: () => dashboardService.getDateRange(), initialOnly: true },
      { key: 'regions', fetchFn: () => dashboardService.getRegions(), initialOnly: true },
    ];

    endpoints.forEach((ep) => {
      if (ep.initialOnly && initialFetchRef.current) return;
      fetchEndpoint(ep.key, ep.fetchFn, currentRequestId);
    });

    initialFetchRef.current = true;
  }, [fetchEndpoint]);

  const setFilters = useCallback((newFilters: FilterParams) => {
    setFiltersState(newFilters);
    fetchData(newFilters);
  }, [fetchData]);

  useEffect(() => {
    fetchData(filters);

    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  const loading = Object.values(loadings).some((v) => v);

  const refetch = useCallback(() => fetchData(filters), [filters, fetchData]);

  return {
    ...data,
    loading,
    loadings,
    error,
    filters,
    setFilters,
    refetch,
  };
};
