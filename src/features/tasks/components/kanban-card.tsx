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

  let dateColor = 'text-slate-600 bg-slate-100/90 border-slate-200/70 dark:text-muted-foreground dark:bg-neutral-800/80 dark:border-neutral-700/60';
  if (isValidDate) {
    const diff = differenceInDays(dueDate, new Date());
    if (diff < 0) {
      dateColor =
        'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60';
    } else if (diff <= 3) {
      dateColor =
        'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60';
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-lg p-3.5 mb-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-blue-400/50 dark:hover:border-neutral-700 transition-all duration-150 group cursor-grab active:cursor-grabbing space-y-2.5">
      <div className="flex items-center justify-between gap-x-2">
        {task.project ? (
          <div className="flex items-center gap-x-1.5 min-w-0 bg-slate-100/80 dark:bg-neutral-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-neutral-700/60">
            <ProjectAvatar
              name={task.project.name}
              image={task.project.imageUrl}
              className="size-3.5 shrink-0"
              fallbackClassName="text-[8px]"
            />
            <span className="text-[11px] font-medium text-slate-700 dark:text-neutral-300 truncate max-w-[130px]">
              {task.project.name}
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 px-1.5 py-0.5 bg-slate-100 dark:bg-neutral-800 rounded">
            Task
          </span>
        )}
        <Taskactions id={task.$id} projectId={task.projectId}>
          <button
            type="button"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-neutral-800 transition opacity-60 group-hover:opacity-100 cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </Taskactions>
      </div>

      <p className="text-sm font-semibold text-slate-900 dark:text-neutral-100 line-clamp-2 leading-snug">
        {task.name}
      </p>

      <div className="flex items-center justify-between pt-1">
        {isValidDate ? (
          <div
            className={cn(
              'flex items-center gap-x-1 text-[11px] font-medium px-2 py-0.5 rounded-md border',
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
