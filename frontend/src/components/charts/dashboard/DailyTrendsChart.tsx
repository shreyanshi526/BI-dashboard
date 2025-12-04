import React, { memo } from 'react';
import { Chart } from '@/components/charts';
import { DailyTrend } from '@/services';
import { formatCurrency, formatDate, formatNumber } from '@/utils/formatters';
import { AreaChartData } from '@/components/charts/generic/AreaChart';

interface DailyTrendsChartProps {
  data: DailyTrend[];
}

interface ExtendedAreaChartData extends AreaChartData {
  date: string;
  cost: number;
  tokens: number;
  users: number;
  transactions: number;
}

export const DailyTrendsChart = memo<DailyTrendsChartProps>(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">No daily trends data available</p>
      </div>
    );
  }

  const tooltipFormatter = (_value: number, _name: string, item: AreaChartData): React.ReactNode => {
    const dailyItem = item as unknown as ExtendedAreaChartData;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-white mb-2">{dailyItem.date ? formatDate(dailyItem.date) : 'Unknown Date'}</p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-300">
            Cost: <span className="text-brand-400 font-medium">{formatCurrency(dailyItem.cost)}</span>
          </p>
          <p className="text-slate-300">
            Tokens: <span className="text-white font-medium">{formatNumber(dailyItem.tokens)}</span>
          </p>
          <p className="text-slate-300">
            Users: <span className="text-white font-medium">{dailyItem.users}</span>
          </p>
        </div>
      </div>
    );
  };

  const xAxisFormatter = (value: string | number): string => {
    return formatDate(String(value));
  };

  return (
    <Chart
      type="area"
      data={data as ExtendedAreaChartData[]}
      dataKey="cost"
      xAxisKey="date"
      xAxisFormatter={xAxisFormatter}
      yAxisFormatter={formatCurrency}
      strokeColor="#338cff"
      fillGradient={{ start: '#338cff', end: 'transparent' }}
      tooltipFormatter={tooltipFormatter}
      height={300}
    />
  );
});

