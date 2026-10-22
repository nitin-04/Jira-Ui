'use client';

import { CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Task } from '../types';
import { Taskactions } from './task-actions';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
}

export const Kanbancard = ({ task }: KanbanCardProps) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isValidDate = dueDate && !isNaN(dueDate.getTime());

  let dateColor = 'text-muted-foreground bg-neutral-100 dark:bg-neutral-800';
  if (isValidDate) {
    const diff = differenceInDays(dueDate, new Date());
    if (diff < 0) {
      dateColor =
        'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/60 dark:border-rose-900/40';
    } else if (diff <= 3) {
      dateColor =
        'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-900/40';
    } else {
      dateColor =
        'text-muted-foreground bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60';
    }
  }

  return (
    <div className="bg-card text-card-foreground border border-border/80 rounded-lg p-3 mb-2 shadow-xs hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-150 group cursor-grab active:cursor-grabbing space-y-2.5">
      <div className="flex items-center justify-between gap-x-2">
        {task.project ? (
          <div className="flex items-center gap-x-1.5 min-w-0">
            <ProjectAvatar
              name={task.project.name}
              image={task.project.imageUrl}
              className="size-4 shrink-0"
              fallbackClassName="text-[9px]"
            />
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">
              {task.project.name}
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
            Task
          </span>
        )}
        <Taskactions id={task.$id} projectId={task.projectId}>
          <button
            type="button"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition opacity-60 group-hover:opacity-100 cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </Taskactions>
      </div>

      <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
        {task.name}
      </p>

      <div className="flex items-center justify-between pt-1">
        {isValidDate ? (
          <div
            className={cn(
              'flex items-center gap-x-1 text-[11px] font-medium px-2 py-0.5 rounded-md',
              dateColor
            )}
          >
            <CalendarIcon className="size-3 shrink-0" />
            <span>{format(dueDate, 'MMM d')}</span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-x-1.5">
          <MemberAvatar
            name={task.assignee?.name}
            className="size-5 shrink-0"
            fallbackClassName="text-[10px]"
          />
        </div>
      </div>
    </div>
  );
};
