'use client';

import { Analytics } from '@/components/analytics';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { Member } from '@/features/members/types';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { Project } from '@/features/projects/types';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { Task } from '@/features/tasks/types';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-workspace-analytics';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { snakeCasetoTitleCase } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  FolderGit2Icon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <Analytics data={analytics} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 flex flex-col">
          <TaskList data={tasks.documents} total={tasks.total} />
        </div>

        <div className="xl:col-span-5 flex flex-col gap-y-6">
          <ProjectList data={projects.documents} total={projects.total} />
          <MembersList data={members.documents} total={members.total} />
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-x-2.5">
          <p className="text-base font-bold text-slate-900 dark:text-foreground">Tasks</p>
          <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200/60 dark:border-neutral-700">
            {total}
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => createTask()}
          className="gap-x-1.5 h-8 text-xs font-semibold shadow-xs"
        >
          <PlusIcon className="size-3.5" />
          <span>New Task</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-12 rounded-full bg-blue-50 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <CheckCircle2Icon className="size-6 text-blue-600 dark:text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-foreground">No tasks found</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Create tasks to track deliverables, milestones, and sprint progress.
          </p>
          <Button
            size="sm"
            onClick={() => createTask()}
            className="mt-4 gap-x-1.5 h-8 text-xs font-semibold"
          >
            <PlusIcon className="size-3.5" />
            Create your first task
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-y-2.5 my-4 flex-1">
          {data.slice(0, 6).map((task) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const isValidDate = dueDate && !isNaN(dueDate.getTime());

            return (
              <li key={task.$id}>
                <Link
                  href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
                  className="block group"
                >
                  <div className="p-3.5 rounded-lg border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:bg-blue-50/30 dark:hover:bg-neutral-800/40 hover:border-blue-300 dark:hover:border-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-xs transition flex items-center justify-between gap-x-4">
                    <div className="flex flex-col gap-y-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                        {task.project && (
                          <div className="flex items-center gap-x-1.5 bg-slate-100/80 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-700 dark:text-neutral-300">
                            <ProjectAvatar
                              className="size-3.5"
                              fallbackClassName="text-[8px]"
                              name={task.project.name}
                              image={task.project.imageUrl}
                            />
                            <span className="truncate max-w-[120px]">
                              {task.project.name}
                            </span>
                          </div>
                        )}
                        {task.project && isValidDate && (
                          <span className="size-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
                        )}
                        {isValidDate && (
                          <div className="flex items-center gap-x-1 text-slate-600 dark:text-neutral-400">
                            <CalendarIcon className="size-3 text-slate-400" />
                            <span>
                              {formatDistanceToNow(dueDate, { addSuffix: true })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-x-2.5 shrink-0">
                      <Badge variant={task.status} className="text-[11px] font-semibold py-0.5 px-2 h-5 shadow-none">
                        {snakeCasetoTitleCase(task.status)}
                      </Badge>
                      <MemberAvatar
                        name={task.assignee?.name}
                        className="size-6"
                        fallbackClassName="text-[10px]"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {data.length > 0 && (
        <Button variant="outline" className="w-full mt-auto h-9 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`} className="flex items-center justify-center gap-x-1.5">
            <span>View All Tasks ({total})</span>
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </Button>
      )}
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-x-2.5">
          <p className="text-base font-bold text-slate-900 dark:text-foreground">Projects</p>
          <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200/60 dark:border-neutral-700">
            {total}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={createProject}
          className="gap-x-1.5 h-8 text-xs font-semibold shadow-xs hover:bg-slate-50 dark:hover:bg-neutral-800"
        >
          <PlusIcon className="size-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="size-10 rounded-full bg-blue-50 dark:bg-neutral-800 flex items-center justify-center mb-2.5">
            <FolderGit2Icon className="size-5 text-blue-600 dark:text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
            Organize tasks into projects for your team.
          </p>
          <Button
            size="sm"
            onClick={createProject}
            className="mt-3 gap-x-1.5 h-8 text-xs font-semibold"
          >
            <PlusIcon className="size-3.5" />
            Create Project
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {data.slice(0, 6).map((project) => (
            <li key={project.$id}>
              <Link
                href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                className="block group"
              >
                <div className="p-3 rounded-lg border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:bg-blue-50/30 dark:hover:bg-neutral-800/40 hover:border-blue-300 dark:hover:border-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-xs transition flex items-center gap-x-3">
                  <ProjectAvatar
                    className="size-8 rounded-lg"
                    fallbackClassName="text-sm font-bold"
                    name={project.name}
                    image={project.imageUrl}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                      {project.name}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
}

export const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-x-2.5">
          <p className="text-base font-bold text-slate-900 dark:text-foreground">Team Members</p>
          <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200/60 dark:border-neutral-700">
            {total}
          </span>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold gap-x-1.5 text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground hover:bg-slate-100/80">
          <Link href={`/workspaces/${workspaceId}/members`}>
            <SettingsIcon className="size-3.5" />
            <span>Manage</span>
          </Link>
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="size-10 rounded-full bg-blue-50 dark:bg-neutral-800 flex items-center justify-center mb-2.5">
            <UsersIcon className="size-5 text-blue-600 dark:text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-foreground">No members found</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {data.slice(0, 6).map((member) => (
            <li key={member.$id}>
              <div className="p-3 rounded-lg border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-x-3">
                <MemberAvatar className="size-8" name={member.name} />
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-foreground truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
