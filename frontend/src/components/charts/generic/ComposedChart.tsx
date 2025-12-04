import { ComposedChart as RechartsComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

export interface ComposedChartData {
  [key: string]: string | number | unknown;
}

export interface ComposedChartProps {
  data: ComposedChartData[];
  barDataKey: string;
  lineDataKey: string;
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  barColor?: string;
  lineColor?: string;
  barGradient?: { start: string; end: string };
  xAxisFormatter?: (value: string | number) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string, item: ComposedChartData) => React.ReactNode;
}

export const ComposedChart: React.FC<ComposedChartProps> = ({
  data,
  barDataKey,
  lineDataKey,
  xAxisKey,
  height = 300,
  showGrid = true,
  barColor = '#8b5cf6',
  lineColor = '#10b981',
  barGradient,
  xAxisFormatter,
  yAxisFormatter = (value) => formatCurrency(value),
  tooltipFormatter,
}) => {
  const xKey = xAxisKey || Object.keys(data[0] || {})[0];
  const gradientId = `barGradient-${barDataKey}`;

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ payload: ComposedChartData; dataKey: string; value: number; color: string }>; 
    label?: string 
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      
      if (tooltipFormatter) {
        const barValue = item[barDataKey] as number;
        return <div>{tooltipFormatter(barValue, barDataKey, item)}</div>;
      }

      const barPayload = payload.find(p => p.dataKey === barDataKey);
      const linePayload = payload.find(p => p.dataKey === lineDataKey);

      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white mb-2">{xAxisFormatter ? xAxisFormatter(label || '') : label}</p>
          <div className="space-y-1 text-sm">
            {barPayload && (
              <p className="text-slate-300">
                {barDataKey}: <span className="text-brand-400 font-medium">{yAxisFormatter(barPayload.value as number)}</span>
              </p>
            )}
            {linePayload && (
              <p className="text-slate-300">
                {lineDataKey}: <span className="text-emerald-400 font-medium">{linePayload.value}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {barGradient && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={barGradient.start} stopOpacity={0.8} />
                <stop offset="100%" stopColor={barGradient.end} stopOpacity={0.4} />
              </linearGradient>
            </defs>
          )}
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />}
          <XAxis
            dataKey={xKey}
            tickFormatter={xAxisFormatter}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={yAxisFormatter}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            yAxisId="left" 
            dataKey={barDataKey} 
            fill={barGradient ? `url(#${gradientId})` : barColor}
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={lineDataKey}
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, strokeWidth: 0, r: 4 }}
          />
        </RechartsComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

