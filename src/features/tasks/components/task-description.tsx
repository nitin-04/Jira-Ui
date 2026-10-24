import { Button } from '@/components/ui/button';
import { Task } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useUpdateTask } from '../api/use-update-task';

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-neutral-800">
        <p className="text-base font-bold text-slate-900 dark:text-foreground">Description</p>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          size="sm"
          variant="outline"
          className="h-8 text-xs font-semibold gap-x-1.5"
        >
          {isEditing ? (
            <XIcon className="size-3.5" />
          ) : (
            <PencilIcon className="size-3.5" />
          )}
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </Button>
      </div>
      <div className="pt-4">
        {isEditing ? (
          <div className="flex flex-col gap-y-4">
            <Textarea
              placeholder="Add a detailed description..."
              value={value}
              rows={4}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
              className="resize-none font-normal"
            />
            <Button
              size="sm"
              variant="primary"
              className="w-fit ml-auto font-semibold text-xs"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        ) : (
          <div className="text-sm leading-relaxed text-slate-700 dark:text-neutral-300">
            {task.description || (
              <span className="text-muted-foreground italic">No description provided yet</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
