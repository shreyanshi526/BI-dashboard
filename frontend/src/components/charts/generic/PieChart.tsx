import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatNumber } from '@/utils/formatters';

export interface PieChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface PieChartProps {
  data: PieChartData[];
  dataKey?: string;
  nameKey?: string;
  valueKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  showLegend?: boolean;
  height?: number;
  tooltipFormatter?: (value: number, name: string, item: PieChartData) => React.ReactNode;
  getColor?: (entry: PieChartData, index: number) => string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  dataKey: _dataKey = 'value',
  nameKey = 'name',
  valueKey = 'value',
  innerRadius = 0,
  outerRadius = 100,
  colors = ['#338cff', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'],
  showLegend = true,
  height = 300,
  tooltipFormatter,
  getColor,
}) => {
  const chartData = data.map((item) => ({
    ...item,
    [nameKey]: (item[nameKey] as string) || item.name,
    [valueKey]: (item[valueKey] as number) || item.value,
  }));

  const total = data.reduce((sum, item) => {
    const val = (item[valueKey] as number) || item.value || 0;
    return sum + val;
  }, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: PieChartData }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const value = (item[valueKey] as number) || item.value || 0;
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
      const name = (item[nameKey] as string) || item.name;
      
      if (tooltipFormatter) {
        return <div>{tooltipFormatter(value, name, item)}</div>;
      }

      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white mb-2">{name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              Value: <span className="text-white font-medium">{formatNumber(value)}</span>
            </p>
            <p className="text-slate-300">
              Share: <span className="text-white font-medium">{percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    if (!showLegend) return null;
    const { payload } = props;
    if (!payload || !Array.isArray(payload)) return null;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color || '#338cff' }}
            />
            <span className="text-slate-300">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={valueKey}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor ? getColor(entry, index) : colors[index % colors.length]}
                className="transition-opacity hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={renderLegend} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

