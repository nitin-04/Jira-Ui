'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Columns3, Loader, PlusIcon, Table2 } from 'lucide-react';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetTasks } from '../api/use-get-tasks';
import { useQueryState } from 'nuqs';
import { DataCalendar } from './data-calendar';

import { useTaskFilters } from '../hooks/use-task-filters';
import { DataTable } from './data-table';
import { columns } from './columns';
import { DataKanban } from './data-kanban';
import { TaskStatus } from '../types';
import { useBulkUpdateTasks } from '../api/use-bulk-update-tasks';
import { DataFilters } from './data-filters';
import { useProjectId } from '@/features/projects/hooks/use-project-id';

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();

  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });

  const workspaceId = useWorkspaceId();

  const paramProjectId = useProjectId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId: paramProjectId || projectId,
    dueDate,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate],
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-xs"
    >
      <div className="h-full flex flex-col overflow-auto p-4 sm:p-5">
        <div className="flex flex-col gap-y-3 sm:flex-row justify-between items-stretch sm:items-center">
          <TabsList className="w-full sm:w-auto h-9 p-1 bg-slate-100 dark:bg-neutral-800/90 border border-slate-200/80 dark:border-neutral-700/80 rounded-lg">
            <TabsTrigger
              className="h-7 px-3 text-xs font-semibold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs"
              value="table"
            >
              <Table2 className="size-3.5" />
              <span>Table</span>
            </TabsTrigger>
            <TabsTrigger
              className="h-7 px-3 text-xs font-semibold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs"
              value="kanban"
            >
              <Columns3 className="size-3.5" />
              <span>Kanban</span>
            </TabsTrigger>
            <TabsTrigger
              className="h-7 px-3 text-xs font-semibold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs"
              value="calendar"
            >
              <CalendarDays className="size-3.5" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
          <Button
            variant="primary"
            onClick={() => open()}
            size="sm"
            className="w-full sm:w-auto h-8 text-xs font-semibold gap-x-1.5 shadow-xs"
          >
            <PlusIcon className="size-3.5" />
            <span>New Task</span>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border border-slate-200/80 dark:border-neutral-800 rounded-lg h-[240px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
