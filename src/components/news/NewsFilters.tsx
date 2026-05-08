import { Search, RotateCcw } from 'lucide-react';
import { SortOption } from '../../hooks/useNews';

interface NewsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function NewsFilters({ 
  searchQuery, 
  onSearchChange, 
  sortOption, 
  onSortChange, 
  onRefresh, 
  isLoading 
}: NewsFiltersProps) {
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-[80px] z-40">
      
      {/* Search Bar */}
      <div className="relative w-full md:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search titles, content, or sources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="flex-1 md:flex-none block px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="source_az">Source (A-Z)</option>
        </select>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 group"
        >
          <RotateCcw size={16} className={isLoading ? "animate-spin text-blue-500" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"} />
          <span className="hidden sm:inline text-slate-700 dark:text-slate-300">Refresh</span>
        </button>
      </div>
    </div>
  );
}
