import { memo } from 'react';
import { ChartCard } from '@/components/ChartCard';
import { ChartSkeleton } from '@/components/ChartSkeleton';
import {
  CostByModelChart,
  DailyTrendsChart,
  MonthlyTrendsChart,
  TokenDistributionChart,
} from '@/components/charts/dashboard';
import { TopUsersTable } from '@/components/TopUsersTable';
import {
  CostByModel,
  DailyTrend,
  MonthlyTrend,
  TokenDistribution,
  TopUser,
} from '@/services';

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

interface DashboardChartsProps {
  costByModel: CostByModel[];
  dailyTrends: DailyTrend[];
  monthlyTrends: MonthlyTrend[];
  tokenDistribution: TokenDistribution[];
  topUsers: TopUser[];
  loadings?: LoadingStates;
}

export const DashboardCharts = memo<DashboardChartsProps>(({
  costByModel,
  dailyTrends,
  monthlyTrends,
  tokenDistribution,
  topUsers,
  loadings,
}) => {
  return (
    <>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Daily Cost Trend" 
          subtitle="Cost over time across all models"
          delay={0.2}
        >
          {loadings?.dailyTrends ? (
            <ChartSkeleton height={300} />
          ) : (
            <DailyTrendsChart data={dailyTrends} />
          )}
        </ChartCard>
        
        <ChartCard 
          title="Monthly Overview" 
          subtitle="Cost (bars) and active users (line)"
          delay={0.3}
        >
          {loadings?.monthlyTrends ? (
            <ChartSkeleton height={300} />
          ) : (
            <MonthlyTrendsChart data={monthlyTrends} />
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Cost by AI Model" 
          subtitle="Spending distribution"
          delay={0.4}
        >
          {loadings?.costByModel ? (
            <ChartSkeleton height={300} />
          ) : (
            <CostByModelChart data={costByModel} />
          )}
        </ChartCard>
        
        <ChartCard 
          title="Token Distribution" 
          subtitle="Prompt vs Completion"
          delay={0.5}
        >
          {loadings?.tokenDistribution ? (
            <ChartSkeleton height={200} />
          ) : (
            <TokenDistributionChart data={tokenDistribution} />
          )}
        </ChartCard>
      </div>

      {/* Top Users Table */}
      <ChartCard 
        title="Top Users by Spending" 
        subtitle="Highest consuming accounts"
        delay={0.6}
        className="mb-6"
      >
        {loadings?.topUsers ? (
          <ChartSkeleton height={400} />
        ) : (
          <TopUsersTable data={topUsers} />
        )}
      </ChartCard>
    </>
  );
});

