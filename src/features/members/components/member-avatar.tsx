import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  name?: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  name = 'Member',
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        'size-5 transition border border-slate-200 dark:border-neutral-700 rounded-full shrink-0 shadow-2xs',
        className
      )}
    >
      <AvatarFallback
        className={cn(
          'bg-slate-100 dark:bg-neutral-800 font-semibold text-slate-700 dark:text-neutral-300 text-xs flex items-center justify-center',
          fallbackClassName
        )}
      >
        {name ? name.charAt(0).toUpperCase() : '?'}
      </AvatarFallback>
    </Avatar>
  );
};
