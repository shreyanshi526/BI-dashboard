import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

export interface BarChartData {
  [key: string]: string | number | unknown;
}

export interface BarChartProps {
  data: BarChartData[];
  dataKey: string;
  xAxisKey?: string;
  orientation?: 'horizontal' | 'vertical';
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string, item: BarChartData) => React.ReactNode;
  getColor?: (entry: BarChartData, index: number) => string;
  barRadius?: number | [number, number, number, number];
  maxBarSize?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  orientation = 'vertical',
  colors = ['#338cff', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'],
  height = 300,
  showGrid = false,
  xAxisFormatter: _xAxisFormatter,
  yAxisFormatter = (value) => formatCurrency(value),
  tooltipFormatter,
  getColor,
  barRadius = [4, 4, 0, 0],
  maxBarSize = 50,
}) => {
  const isHorizontal = orientation === 'horizontal';
  const xKey = xAxisKey || (isHorizontal ? 'name' : Object.keys(data[0] || {})[0]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: BarChartData; dataKey: string }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const value = item[dataKey] as number;
      
      if (tooltipFormatter) {
        return <div>{tooltipFormatter(value, dataKey, item)}</div>;
      }

      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white mb-2">{item[xKey] as string}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              {dataKey}: <span className="text-white font-medium">{yAxisFormatter(value)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={isHorizontal ? 'vertical' : undefined}
          margin={{ top: 10, right: 10, left: 0, bottom: isHorizontal ? 0 : 40 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={!isHorizontal} horizontal={isHorizontal} />}
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                tickFormatter={yAxisFormatter}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tickFormatter={yAxisFormatter}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey={dataKey} radius={barRadius} maxBarSize={maxBarSize}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor ? getColor(entry, index) : colors[index % colors.length]}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

