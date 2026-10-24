'use client';

import { snakeCasetoTitleCase } from '@/lib/utils';
import { TaskStatus } from '../types';

import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusConfig: Record<
  TaskStatus,
  { icon: React.ReactNode; color: string; dotBg: string }
> = {
  [TaskStatus.BACKLOG]: {
    icon: <CircleDashedIcon className="size-4 text-slate-500" />,
    color: 'border-slate-300 dark:border-slate-700',
    dotBg: 'bg-slate-400',
  },
  [TaskStatus.TODO]: {
    icon: <CircleIcon className="size-4 text-rose-500" />,
    color: 'border-rose-300 dark:border-rose-800',
    dotBg: 'bg-rose-500',
  },
  [TaskStatus.IN_PROGRESS]: {
    icon: <CircleDotDashedIcon className="size-4 text-amber-500" />,
    color: 'border-amber-300 dark:border-amber-800',
    dotBg: 'bg-amber-500',
  },
  [TaskStatus.IN_REVIEW]: {
    icon: <CircleDotIcon className="size-4 text-blue-500" />,
    color: 'border-blue-300 dark:border-blue-800',
    dotBg: 'bg-blue-500',
  },
  [TaskStatus.DONE]: {
    icon: <CircleCheckIcon className="size-4 text-emerald-500" />,
    color: 'border-emerald-300 dark:border-emerald-800',
    dotBg: 'bg-emerald-500',
  },
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const { icon } = statusConfig[board];

  return (
    <div className="px-2 py-2 mb-2 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-bold text-slate-800 dark:text-neutral-100 tracking-tight">
          {snakeCasetoTitleCase(board)}
        </h2>
        <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-slate-200/80 dark:bg-neutral-800 text-[11px] text-slate-700 dark:text-neutral-300 font-bold">
          {taskCount}
        </span>
      </div>

      <Button
        className="size-6 rounded-md hover:bg-slate-200/80 dark:hover:bg-neutral-800 text-slate-500 hover:text-slate-900 dark:hover:text-foreground transition cursor-pointer"
        onClick={() => open(board)}
        variant="ghost"
        size="icon"
        title={`Add task to ${snakeCasetoTitleCase(board)}`}
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
};
