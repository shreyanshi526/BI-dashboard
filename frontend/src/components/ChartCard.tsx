import { memo } from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const ChartCard = memo<ChartCardProps>(({
  title,
  subtitle,
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        rounded-2xl p-6
        bg-slate-800/50 backdrop-blur-sm
        border border-slate-700/50
        ${className}
      `}
    >
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
});

