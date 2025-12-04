import { memo } from 'react';
import { motion } from 'framer-motion';
import { TopUser } from '@/services';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Crown, Building2 } from 'lucide-react';

interface TopUsersTableProps {
  data: TopUser[];
}

export const TopUsersTable = memo<TopUsersTableProps>(({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-slate-400 border-b border-slate-700/50">
            <th className="pb-3 font-medium">#</th>
            <th className="pb-3 font-medium">User</th>
            <th className="pb-3 font-medium">Company</th>
            <th className="pb-3 font-medium">Region</th>
            <th className="pb-3 font-medium text-right">Tokens</th>
            <th className="pb-3 font-medium text-right">Cost</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((user, index) => (
            <motion.tr
              key={user.userName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-3">
                <span className={`
                  font-mono text-xs px-2 py-1 rounded
                  ${index === 0 ? 'bg-amber-500/20 text-amber-400' : 
                    index === 1 ? 'bg-slate-400/20 text-slate-300' :
                    index === 2 ? 'bg-orange-600/20 text-orange-400' :
                    'bg-slate-700/50 text-slate-400'}
                `}>
                  {index + 1}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{user.userName}</span>
                  {user.isProUser && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-violet-500/20 text-violet-400">
                      <Crown className="w-3 h-3" />
                      Pro
                    </span>
                  )}
                </div>
                <span className="text-slate-500 text-xs">{user.department}</span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  {user.company}
                </div>
              </td>
              <td className="py-3">
                <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-300 text-xs">
                  {user.region}
                </span>
              </td>
              <td className="py-3 text-right">
                <span className="font-mono text-slate-300">{formatNumber(user.tokens)}</span>
              </td>
              <td className="py-3 text-right">
                <span className="font-mono text-brand-400 font-medium">{formatCurrency(user.cost)}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

