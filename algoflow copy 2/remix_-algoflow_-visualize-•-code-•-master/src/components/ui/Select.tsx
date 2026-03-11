import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, children, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              'w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white appearance-none cursor-pointer',
              icon && 'pl-12',
              error && 'border-rose-500 focus:ring-rose-500/50',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
