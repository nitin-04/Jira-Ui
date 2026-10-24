'use client';

import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface TaskDateProps {
  value: string;
  className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
  if (!value) return null;

  const today = new Date();
  const endDate = new Date(value);

  if (isNaN(endDate.getTime())) {
    return null;
  }

  const diffInDays = differenceInDays(endDate, today);

  let textColor = 'text-slate-600 dark:text-muted-foreground';
  if (diffInDays < 0) {
    textColor = 'text-rose-600 dark:text-rose-400 font-medium';
  } else if (diffInDays <= 3) {
    textColor = 'text-amber-600 dark:text-amber-400 font-medium';
  }

  return (
    <div className={cn('flex items-center gap-x-1.5 text-xs', textColor)}>
      <CalendarIcon className="size-3.5 shrink-0 opacity-70" />
      <span className={cn('truncate', className)}>{format(endDate, 'PP')}</span>
    </div>
  );
};
