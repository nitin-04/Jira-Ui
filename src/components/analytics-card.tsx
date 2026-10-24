import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: 'up' | 'down';
  increaseValue: number;
  icon?: React.ReactNode;
  iconBg?: string;
}

export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
  icon,
  iconBg = 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
}: AnalyticsCardProps) => {
  const isPositive = variant === 'up';
  const Icon = isPositive ? FaCaretUp : FaCaretDown;

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between gap-y-3 min-w-[170px]">
      <div className="flex items-center justify-between gap-x-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          {title}
        </span>
        {icon && (
          <div className={cn('size-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-x-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>

        <div
          className={cn(
            'flex items-center gap-x-0.5 px-1.5 py-0.5 rounded-md text-xs font-semibold border',
            isPositive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50'
              : 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50'
          )}
        >
          <Icon className="size-3" />
          <span>{Math.abs(increaseValue)}</span>
        </div>
      </div>
    </div>
  );
};
