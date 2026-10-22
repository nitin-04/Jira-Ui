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

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-4 text-pink-500" />
  ),
  [TaskStatus.TODO]: <CircleIcon className="size-4 text-rose-500" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-4 text-amber-500" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-4 text-blue-500" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-4 text-emerald-500" />
  ),
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <div className="px-2 py-2 mb-1 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-semibold text-foreground tracking-tight">
          {snakeCasetoTitleCase(board)}
        </h2>
        <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-300 font-semibold">
          {taskCount}
        </span>
      </div>

      <Button
        className="size-6 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-foreground transition"
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
