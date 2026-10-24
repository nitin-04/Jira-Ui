import { Button } from '@/components/ui/button';
import { Task } from '../types';
import { PencilIcon } from 'lucide-react';
import { OverviewProperty } from './overview-property';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from './task-date';
import { Badge } from '@/components/ui/badge';
import { snakeCasetoTitleCase } from '@/lib/utils';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-neutral-800">
          <p className="text-base font-bold text-slate-900 dark:text-foreground">Overview</p>
          <Button onClick={() => open(task.$id)} size="sm" variant="outline" className="h-8 text-xs font-semibold gap-x-1.5">
            <PencilIcon className="size-3.5" />
            <span>Edit</span>
          </Button>
        </div>
        <div className="flex flex-col gap-y-4 pt-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar
              name={task.assignee?.name ?? 'Unassigned'}
              className="size-6"
            />
            <p className="text-sm font-semibold text-slate-800 dark:text-foreground">
              {task.assignee?.name ?? 'Unassigned'}
            </p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-semibold text-slate-800 dark:text-foreground" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status} className="font-semibold text-xs">
              {snakeCasetoTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
