import React, { memo } from 'react';
import { Chart } from '@/components/charts';
import { MonthlyTrend } from '@/services';
import { formatCurrency, formatMonth, formatNumber } from '@/utils/formatters';
import { ComposedChartData } from '@/components/charts/generic/ComposedChart';

interface MonthlyTrendsChartProps {
  data: MonthlyTrend[];
}

interface ExtendedComposedChartData extends ComposedChartData {
  month: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export const MonthlyTrendsChart = memo<MonthlyTrendsChartProps>(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">No monthly trends data available</p>
      </div>
    );
  }

  const tooltipFormatter = (_value: number, _name: string, item: ComposedChartData): React.ReactNode => {
    const monthlyItem = item as unknown as ExtendedComposedChartData;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-white mb-2">{formatMonth(monthlyItem.month)}</p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-300">
            Cost: <span className="text-brand-400 font-medium">{formatCurrency(monthlyItem.cost)}</span>
          </p>
          <p className="text-slate-300">
            Users: <span className="text-emerald-400 font-medium">{monthlyItem.users}</span>
          </p>
          <p className="text-slate-300">
            Transactions: <span className="text-white font-medium">{formatNumber(monthlyItem.transactions)}</span>
          </p>
        </div>
      </div>
    );
  };

  const xAxisFormatter = (value: string | number): string => {
    return formatMonth(String(value));
  };

  return (
    <Chart
      type="composed"
      data={data as ExtendedComposedChartData[]}
      barDataKey="cost"
      lineDataKey="users"
      xAxisKey="month"
      xAxisFormatter={xAxisFormatter}
      yAxisFormatter={formatCurrency}
      barColor="#8b5cf6"
      lineColor="#10b981"
      barGradient={{ start: '#8b5cf6', end: '#8b5cf6' }}
      tooltipFormatter={tooltipFormatter}
      height={300}
    />
  );
});

