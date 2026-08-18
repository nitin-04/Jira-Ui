import { MoreHorizontal } from 'lucide-react';
import { Task } from '../types';
import { Taskactions } from './task-actions';
import { DottedSeparator } from '@/components/dotted-separator';
import { MemberAvatar } from '@/features/members/components/member-avatar';

interface KanbanCardProps {
  task: Task;
}

export const Kanbancard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <Taskactions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </Taskactions>
      </div>
      <DottedSeparator />

      <div className=" flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.name} />
      </div>
    </div>
  );
};
