import { ExternalLink, Calendar, Link2 } from 'lucide-react';
import { TavilyArticle } from '../../services/tavilyService';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils/cn';

interface NewsCardProps {
  article: TavilyArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  // Extract domain for source
  let domain = 'Source';
  try {
    domain = new URL(article.url).hostname.replace('www.', '');
  } catch (e) {
    // Ignore invalid urls
  }

  // Format date safely
  let timeAgo = 'Recently';
  try {
    const pubDate = new Date(article.published_date);
    if (!isNaN(pubDate.getTime())) {
      timeAgo = formatDistanceToNow(pubDate, { addSuffix: true });
    }
  } catch (error) {
    // Keep 'Recently'
  }

  // Placeholder image if none provided by Tavily (often Tavily misses images for some queries unless strictly enforced)
  const imageUrl = article.image || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop`;

  return (
    <div className={cn(
      "group flex flex-col bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md rounded-2xl overflow-hidden",
      "border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300",
      "hover:shadow-md hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-1"
    )}>
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full">
          <Link2 size={12} />
          {domain}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 gap-1.5">
          <Calendar size={14} />
          <span>{timeAgo}</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-5 flex-1">
          {article.content}
        </p>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl transition-colors mt-auto"
        >
          Read Full Article
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
