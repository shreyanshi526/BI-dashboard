import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="p-4 rounded-full bg-rose-500/10 inline-flex mb-4">
          <AlertCircle className="w-12 h-12 text-rose-400" />
        </div>
        <h2 className="text-xl font-display font-semibold text-white mb-2">
          Failed to Load Dashboard
        </h2>
        <p className="text-slate-400 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-brand-600 hover:bg-brand-500 text-white font-medium
                     transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </motion.div>
    </div>
  );
};

