import { memo } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { DateRange } from '@/services';

interface DashboardHeaderProps {
  dateRange: DateRange | null;
}

export const DashboardHeader = memo<DashboardHeaderProps>(({ dateRange }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-500/25"
            >
              <Layers className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-display font-bold text-white">
                AI Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-400">TDK Corporation • AI Center India</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Data Range</p>
              <p className="text-sm text-slate-300 font-mono">
                {dateRange?.minDate} → {dateRange?.maxDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

