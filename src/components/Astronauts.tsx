import { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface AstronautsProps {
  peopleInSpace: number;
  astronauts: { name: string; craft: string }[];
  className?: string;
}

export function Astronauts({ peopleInSpace, astronauts, className }: AstronautsProps) {
  const [expanded, setExpanded] = useState(false);
  
  const displayedAstronauts = expanded ? astronauts : astronauts.slice(0, 5);
  return (
    <div className={cn("bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">People in Space</h3>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{peopleInSpace}</div>
        </div>
        <div className="text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl">
          <Users size={24} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Current Crew</h4>
        <div className="space-y-3 pb-2">
          {displayedAstronauts.length > 0 ? displayedAstronauts.map((astro, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
               <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                 {astro.name.charAt(0)}
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{astro.name}</p>
                 <p className="text-xs text-slate-500">{astro.craft}</p>
               </div>
            </div>
          )) : (
              <p className="text-sm text-slate-500 text-center py-4">Loading crew data...</p>
          )}
          
          {astronauts.length > 5 && (
            <button 
              onClick={() => setExpanded(!expanded)}
              className="w-full py-2 mt-2 flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
            >
              {expanded ? (
                <>Show Less <ChevronUp size={14} /></>
              ) : (
                <>Show All ({astronauts.length}) <ChevronDown size={14} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
