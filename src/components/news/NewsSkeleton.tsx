export function NewsSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
      
      <div className="p-5 flex flex-col h-[280px]">
        {/* Date Skeleton */}
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        
        {/* Title Skeleton */}
        <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2" />
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        
        {/* Content Skeleton */}
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2 mt-auto" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
        
        {/* Button Skeleton */}
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-auto" />
      </div>
    </div>
  );
}
