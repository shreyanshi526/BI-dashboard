import React from 'react';
// Generic charts
export * from './generic';

// Chart component with map
import { PieChart } from './generic/PieChart';
import { BarChart } from './generic/BarChart';
import { LineChart } from './generic/LineChart';
import { AreaChart } from './generic/AreaChart';
import { ComposedChart } from './generic/ComposedChart';
import { TreemapChart } from './generic/TreemapChart';

export type ChartType = 'pie' | 'bar' | 'line' | 'area' | 'composed' | 'treemap';

export type ChartProps =
  | ({ type: 'pie' } & React.ComponentProps<typeof PieChart>)
  | ({ type: 'bar' } & React.ComponentProps<typeof BarChart>)
  | ({ type: 'line' } & React.ComponentProps<typeof LineChart>)
  | ({ type: 'area' } & React.ComponentProps<typeof AreaChart>)
  | ({ type: 'composed' } & React.ComponentProps<typeof ComposedChart>)
  | ({ type: 'treemap' } & React.ComponentProps<typeof TreemapChart>);

const chartMap = {
  pie: PieChart,
  bar: BarChart,
  line: LineChart,
  area: AreaChart,
  composed: ComposedChart,
  treemap: TreemapChart,
};

export const Chart = (props: ChartProps) => {
  const { type, ...rest } = props;
  const Component = chartMap[type];
  if (!Component) return null;
  return <Component {...(rest as any)} />;
};

// Dashboard-specific charts
export * from './dashboard';

