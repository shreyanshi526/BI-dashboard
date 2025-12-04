import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

export interface AreaChartData {
  [key: string]: string | number | unknown;
}

export interface AreaChartProps {
  data: AreaChartData[];
  dataKey: string;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  strokeColor?: string;
  fillGradient?: { start: string; end: string };
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string, item: AreaChartData) => React.ReactNode;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  height = 300,
  showGrid = true,
  strokeColor = '#338cff',
  fillGradient,
  xAxisFormatter,
  yAxisFormatter = (value) => formatCurrency(value),
  tooltipFormatter,
}) => {
  const xKey = xAxisKey || Object.keys(data[0] || {})[0];
  const gradientId = `gradient-${dataKey}`;
  const gradientStart = fillGradient?.start || strokeColor;
  const gradientEnd = fillGradient?.end || 'transparent';

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ payload: AreaChartData; dataKey: string; value: number }>; 
    label?: string 
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const value = payload[0].value as number;
      
      if (tooltipFormatter) {
        return <div>{tooltipFormatter(value, dataKey, item)}</div>;
      }

      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white mb-2">{xAxisFormatter ? xAxisFormatter(label || '') : label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              {dataKey}: <span className="text-brand-400 font-medium">{yAxisFormatter(value)}</span>
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
        <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientStart} stopOpacity={0.3} />
              <stop offset="95%" stopColor={gradientEnd} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />}
          <XAxis
            dataKey={xKey}
            tickFormatter={xAxisFormatter}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

