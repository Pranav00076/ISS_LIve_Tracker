import React from 'react';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
          <div className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
