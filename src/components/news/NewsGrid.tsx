import { NewsCard } from './NewsCard';
import { NewsFilters } from './NewsFilters';
import { NewsSkeleton } from './NewsSkeleton';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { TavilyArticle } from '../../services/tavilyService';
import { SortOption } from '../../hooks/useNews';

interface NewsGridProps {
  articles: TavilyArticle[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  hasMore: boolean;
  loadMore: () => void;
  refreshNews: () => void;
  totalCount: number;
}

export function NewsGrid({
  articles,
  isLoading,
  error,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  hasMore,
  loadMore,
  refreshNews,
  totalCount
}: NewsGridProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-bold">Latest Space & Tech News</h2>
        <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
          Live Updates
        </span>
      </div>

      <NewsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onRefresh={refreshNews}
        isLoading={isLoading}
      />

      {error ? (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-1">Unable to Load News</h3>
            <p className="text-sm text-red-600 dark:text-red-300 max-w-md mx-auto">{error}</p>
          </div>
          <button 
            onClick={refreshNews}
            className="px-6 py-2.5 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {isLoading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <NewsSkeleton key={i} />)}
            </div>
          ) : articles.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {articles.map((article, idx) => (
                 <NewsCard key={`${article.url}-${idx}`} article={article} />
               ))}
             </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 bg-white/50 dark:bg-[#151828]/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
              <p className="text-lg font-medium mb-1">No articles found</p>
              <p className="text-sm">Try adjusting your search query.</p>
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#151828] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl shadow-sm transition-all hover:shadow-md group"
              >
                Load More Articles
                <ChevronDown className="group-hover:translate-y-0.5 transition-transform" size={18} />
              </button>
            </div>
          )}
          
          {!hasMore && articles.length > 0 && totalCount > 0 && (
             <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
               You've reached the end of the recent news feed.
             </div>
          )}
        </>
      )}
    </div>
  );
}
