import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, RotateCcw, Check } from 'lucide-react';
import { FilterParams, DateRange } from '@/services';

interface FilterBarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  regions: string[];
  dateRange: DateRange | null;
}

export const FilterBar = memo<FilterBarProps>(({
  filters,
  onFilterChange,
  regions,
  dateRange,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, startDate: e.target.value || undefined });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, endDate: e.target.value || undefined });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalFilters({ ...localFilters, region: e.target.value === 'all' ? undefined : e.target.value });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterParams = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
    >
      {/* Date Range */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Date Range</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={localFilters.startDate || ''}
            min={dateRange?.minDate}
            max={dateRange?.maxDate}
            onChange={handleStartDateChange}
            className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white text-sm
                       focus:border-brand-500 transition-colors"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={localFilters.endDate || ''}
            min={dateRange?.minDate}
            max={dateRange?.maxDate}
            onChange={handleEndDateChange}
            className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white text-sm
                       focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-slate-700" />

      {/* Region Filter with Apply Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Region</span>
        </div>
        <select
          value={localFilters.region || 'all'}
          onChange={handleRegionChange}
          className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white text-sm
                     focus:border-brand-500 transition-colors min-w-[120px]"
        >
          <option value="all">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <button
          onClick={handleApply}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-brand-500 hover:bg-brand-600 text-white
                     border border-brand-400 transition-all text-sm font-medium
                     shadow-lg shadow-brand-500/20"
        >
          <Check className="w-4 h-4" />
          Apply
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white
                   border border-slate-600/50 transition-all text-sm font-medium"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </motion.div>
  );
});

