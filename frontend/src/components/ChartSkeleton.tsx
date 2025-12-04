import React from 'react';
import { motion } from 'framer-motion';

interface ChartSkeletonProps {
  height?: number;
  delay?: number;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = 300, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="w-full"
      style={{ height: `${height}px` }}
    >
      <div className="h-full w-full bg-slate-800/30 rounded-lg border border-slate-700/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-brand-400 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading chart data...</p>
        </div>
      </div>
    </motion.div>
  );
};

