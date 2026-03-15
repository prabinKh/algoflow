import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline' | 'dark';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm',
      glass: 'bg-white/[0.02] backdrop-blur-xl border border-white/5',
      outline: 'bg-transparent border border-slate-200 dark:border-slate-800',
      dark: 'bg-slate-950 border border-white/5',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8', variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
