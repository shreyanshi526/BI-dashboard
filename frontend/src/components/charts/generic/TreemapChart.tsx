import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '@/utils/formatters';

export interface TreemapChartData {
  name: string;
  size: number;
  [key: string]: string | number | unknown;
}

export interface TreemapChartProps {
  data: TreemapChartData[];
  dataKey?: string;
  nameKey?: string;
  sizeKey?: string;
  colors?: string[];
  height?: number;
  tooltipFormatter?: (value: number, name: string, item: TreemapChartData) => React.ReactNode;
}

interface TreemapContentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  index: number;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({
  data,
  dataKey = 'size',
  nameKey = 'name',
  sizeKey = 'size',
  colors = ['#338cff', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'],
  height = 250,
  tooltipFormatter,
}) => {
  const chartData = data.map((item) => ({
    ...item,
    [nameKey]: item[nameKey] || item.name,
    [sizeKey]: item[sizeKey] || item.size || item[dataKey],
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TreemapChartData }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const size = item[sizeKey] || item.size || 0;
      
      if (tooltipFormatter) {
        return <div>{tooltipFormatter(size as number, item[nameKey] as string, item)}</div>;
      }

      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-white mb-2">{item[nameKey] as string}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              Size: <span className="text-white font-medium">{formatNumber(size as number)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomContent = ({ x, y, width, height, name, index }: TreemapContentProps) => {
    if (width < 50 || height < 30) return null;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={colors[index % colors.length]}
          rx={4}
          className="transition-opacity hover:opacity-80"
        />
        {width > 70 && height > 40 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={width > 100 ? 12 : 10}
            fontWeight={500}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={chartData}
          dataKey={sizeKey}
          aspectRatio={4 / 3}
          stroke="rgba(0,0,0,0.3)"
          content={<CustomContent x={0} y={0} width={0} height={0} name="" index={0} />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

