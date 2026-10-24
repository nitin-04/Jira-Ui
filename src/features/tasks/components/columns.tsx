'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from './task-date';
import { Badge } from '@/components/ui/badge';
import { snakeCasetoTitleCase } from '@/lib/utils';
import { Taskactions } from './task-actions';

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Task Name
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <span className="font-semibold text-xs text-slate-900 dark:text-neutral-100 line-clamp-1">
          {name}
        </span>
      );
    },
  },
  {
    accessorKey: 'project',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <div className="flex items-center gap-x-2 text-xs font-medium">
          <ProjectAvatar
            className="size-5 rounded"
            name={project?.name}
            image={project?.imageUrl}
          />
          <p className="line-clamp-1 text-slate-700 dark:text-neutral-300">{project?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Assignee
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;

      return (
        <div className="flex items-center gap-x-2 text-xs font-medium">
          <MemberAvatar
            className="size-5"
            fallbackClassName="text-[10px]"
            name={assignee?.name}
          />
          <p className="line-clamp-1 text-slate-700 dark:text-neutral-300">{assignee?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <TaskDate value={dueDate} className="text-xs font-medium" />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-1.5 size-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge variant={status} className="text-[11px] font-semibold py-0.5 px-2">
          {snakeCasetoTitleCase(status)}
        </Badge>
      );
    },
  },
  {
    id: 'action',
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;
      return (
        <div className="flex justify-end">
          <Taskactions id={id} projectId={projectId}>
            <Button className="size-8 p-0" variant="ghost">
              <MoreVertical className="size-4" />
            </Button>
          </Taskactions>
        </div>
      );
    },
  },
];
