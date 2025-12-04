import { memo } from 'react';
import { 
  Activity, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Zap, 
  Crown,
  TrendingUp,
} from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { KPICardSkeleton } from '@/components/KPICardSkeleton';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { DashboardSummary } from '@/services';

interface DashboardKPIsProps {
  summary: DashboardSummary | null;
  isLoading?: boolean;
}

export const DashboardKPIs = memo<DashboardKPIsProps>(({ summary, isLoading = false }) => {
  // Show skeleton if loading and no data
  const showSkeleton = isLoading && !summary;

  return (
    <>
      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {showSkeleton ? (
          <>
            <KPICardSkeleton delay={0} />
            <KPICardSkeleton delay={0.1} />
            <KPICardSkeleton delay={0.2} />
            <KPICardSkeleton delay={0.3} />
          </>
        ) : (
          <>
            <KPICard
              title="Total Cost"
              value={summary ? formatCurrency(summary.totalCost || 0) : '$0.00'}
              subtitle="All AI model usage"
              icon={DollarSign}
              color="blue"
              delay={0}
            />
            <KPICard
              title="Total Tokens"
              value={summary ? formatNumber(summary.totalTokens || 0) : '0'}
              subtitle="Prompt + Completion"
              icon={Zap}
              color="violet"
              delay={0.1}
            />
            <KPICard
              title="Active Users"
              value={summary ? (summary.activeUsers || 0).toLocaleString() : '0'}
              subtitle={summary ? `of ${summary.totalUsers || 0} total users` : 'No data'}
              icon={Users}
              color="emerald"
              delay={0.2}
            />
            <KPICard
              title="Conversations"
              value={summary ? (summary.totalConversations || 0).toLocaleString() : '0'}
              subtitle={summary ? `Avg ${formatCurrency(summary.avgCostPerConversation || 0)}/conv` : 'No data'}
              icon={MessageSquare}
              color="cyan"
              delay={0.3}
            />
          </>
        )}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {showSkeleton ? (
          <>
            <KPICardSkeleton delay={0.4} />
            <KPICardSkeleton delay={0.5} />
            <KPICardSkeleton delay={0.6} />
          </>
        ) : (
          <>
            <KPICard
              title="Total Transactions"
              value={summary ? formatNumber(summary.totalTransactions || 0) : '0'}
              icon={Activity}
              color="amber"
              delay={0.4}
            />
            <KPICard
              title="Pro Subscribers"
              value={summary ? (summary.proUsers || 0).toLocaleString() : '0'}
              subtitle={summary ? `${((summary.proUsers || 0) / (summary.totalUsers || 1) * 100).toFixed(1)}% of users` : 'No data'}
              icon={Crown}
              color="rose"
              delay={0.5}
            />
            <KPICard
              title="Avg Tokens/Transaction"
              value={summary ? formatNumber(Math.round((summary.totalTokens || 0) / (summary.totalTransactions || 1))) : '0'}
              icon={TrendingUp}
              color="blue"
              delay={0.6}
            />
          </>
        )}
      </div>
    </>
  );
});

