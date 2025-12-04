import { useDashboardData } from '@/hooks/useDashboardData';
import { FilterBar } from '@/components/FilterBar';
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardKPIs } from './components/DashboardKPIs';
import { DashboardCharts } from './components/DashboardCharts';
import { DashboardFooter } from './components/DashboardFooter';


export const Dashboard = () => {
  const {
    summary,
    costByModel,
    dailyTrends,
    monthlyTrends,
    tokenDistribution,
    topUsers,
    regions,
    dateRange,
    loadings,
    error,
    filters,
    setFilters,
    refetch,
  } = useDashboardData();

  return (
    <div className="min-h-screen mesh-bg">
      <DashboardHeader dateRange={dateRange} />

      <main className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            regions={regions}
            dateRange={dateRange}
          />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* KPIs */}
        <DashboardKPIs summary={summary} isLoading={loadings.summary} />

        {/* Charts */}
        <DashboardCharts
          costByModel={costByModel}
          dailyTrends={dailyTrends}
          monthlyTrends={monthlyTrends}
          tokenDistribution={tokenDistribution}
          topUsers={topUsers}
          loadings={loadings}
        />

        {/* Footer */}
        <DashboardFooter />
      </main>
    </div>
  );
};
