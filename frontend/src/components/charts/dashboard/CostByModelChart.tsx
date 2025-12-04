import React, { memo } from 'react';
import { Chart } from '@/components/charts';
import { CostByModel } from '@/services';
import { formatCurrency, formatNumber, getModelColor } from '@/utils/formatters';
import { PieChartData } from '@/components/charts/generic/PieChart';

interface CostByModelChartProps {
  data: CostByModel[];
}

interface ExtendedPieChartData extends PieChartData {
  model: string;
  cost: number;
  transactions: number;
}

export const CostByModelChart = memo<CostByModelChartProps>(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">No cost data available</p>
      </div>
    );
  }

  const chartData: ExtendedPieChartData[] = data
    .filter((item) => item && item.cost !== null && item.cost !== undefined)
    .map((item) => ({
      name: item.model || 'Unknown',
      value: item.cost || 0,
      model: item.model || 'Unknown',
      cost: item.cost || 0,
      transactions: item.transactions || 0,
      tokens: item.tokens || 0,
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-slate-400 text-sm">No valid cost data available</p>
      </div>
    );
  }

  const totalCost = chartData.reduce((sum, item) => sum + (item.cost || 0), 0);

  const tooltipFormatter = (_value: number, _name: string, item: PieChartData): React.ReactNode => {
    const extendedItem = item as ExtendedPieChartData;
    const percentage = totalCost > 0 ? ((extendedItem.cost / totalCost) * 100).toFixed(1) : '0';
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-white mb-2">{extendedItem.model}</p>
        <div className="space-y-1 text-sm">
          <p className="text-slate-300">
            Cost: <span className="text-white font-medium">{formatCurrency(extendedItem.cost)}</span>
          </p>
          <p className="text-slate-300">
            Share: <span className="text-white font-medium">{percentage}%</span>
          </p>
          <p className="text-slate-300">
            Transactions: <span className="text-white font-medium">{formatNumber(extendedItem.transactions)}</span>
          </p>
        </div>
      </div>
    );
  };

  const getColor = (entry: PieChartData, _index: number): string => {
    const extendedEntry = entry as ExtendedPieChartData;
    return getModelColor(extendedEntry.model);
  };

  return (
    <Chart
      type="pie"
      data={chartData}
      innerRadius={60}
      outerRadius={100}
      getColor={getColor}
      tooltipFormatter={tooltipFormatter}
      height={300}
    />
  );
});

