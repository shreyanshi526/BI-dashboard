import React, { memo } from 'react';
import { Chart } from '@/components/charts';
import { TokenDistribution } from '@/services';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import { PieChartData } from '@/components/charts/generic/PieChart';

interface TokenDistributionChartProps {
  data: TokenDistribution[];
}

const COLORS = ['#338cff', '#8b5cf6'];

interface ExtendedPieChartData extends PieChartData {
  type: string;
  tokens: number;
  cost: number;
}

export const TokenDistributionChart = memo<TokenDistributionChartProps>(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">No token distribution data available</p>
      </div>
    );
  }

  const chartData: ExtendedPieChartData[] = data
    .filter((item) => item && item.tokens !== null && item.tokens !== undefined)
    .map((item) => ({
      name: item.type || 'Unknown',
      value: item.tokens || 0,
      type: item.type || 'Unknown',
      tokens: item.tokens || 0,
      cost: item.cost || 0,
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">No valid token data available</p>
      </div>
    );
  }

  const totalTokens = chartData.reduce((sum, item) => sum + (item.tokens || 0), 0);

  const tooltipFormatter = (_value: number, _name: string, item: PieChartData): React.ReactNode => {
    const extendedItem = item as ExtendedPieChartData;
    const percentage = totalTokens > 0 ? ((extendedItem.tokens / totalTokens) * 100).toFixed(1) : '0';
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-white mb-2 capitalize">{extendedItem.type} Tokens</p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-300">
            Tokens: <span className="text-white font-medium">{formatNumber(extendedItem.tokens)}</span>
          </p>
          <p className="text-slate-300">
            Share: <span className="text-white font-medium">{percentage}%</span>
          </p>
          <p className="text-slate-300">
            Cost: <span className="text-white font-medium">{formatCurrency(extendedItem.cost)}</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[200px] flex items-center gap-6">
      <div className="flex-1 h-full">
        <Chart
          type="pie"
          data={chartData}
          innerRadius={50}
          outerRadius={80}
          colors={COLORS}
          showLegend={false}
          tooltipFormatter={tooltipFormatter}
          height={200}
        />
      </div>
      
      <div className="flex flex-col gap-3">
        {chartData.map((item, index) => {
          const percentage = totalTokens > 0 ? ((item.tokens / totalTokens) * 100).toFixed(1) : '0';
          return (
            <div key={item.type || index} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div>
                <p className="text-sm font-medium text-white capitalize">{item.type || 'Unknown'}</p>
                <p className="text-xs text-slate-400">
                  {formatNumber(item.tokens)} ({percentage}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

