import React from 'react';
import { motion } from 'framer-motion';

interface KPICardSkeletonProps {
  delay?: number;
}

export const KPICardSkeleton: React.FC<KPICardSkeletonProps> = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-slate-700/20 blur-2xl opacity-50" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-slate-700/50 rounded mb-3 animate-pulse" />
          <div className="h-10 w-32 bg-slate-700/50 rounded mb-2 animate-pulse" />
          <div className="h-4 w-40 bg-slate-700/50 rounded animate-pulse" />
        </div>
        
        <div className="p-3 rounded-xl bg-slate-700/20 border border-slate-700/30">
          <div className="w-6 h-6 bg-slate-700/50 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

