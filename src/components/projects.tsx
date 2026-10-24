'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { RiAddCircleFill } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';

export const Projects = () => {
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
          Projects
        </p>
        <button
          type="button"
          onClick={open}
          className="text-muted-foreground hover:text-blue-600 dark:hover:text-foreground transition cursor-pointer"
          title="Create Project"
        >
          <RiAddCircleFill className="size-5" />
        </button>
      </div>

      <div className="flex flex-col gap-y-1">
        {data?.documents.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link href={href} key={project.$id}>
              <div
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-50/90 text-blue-700 dark:bg-neutral-800 dark:text-neutral-100 border border-blue-200/60 dark:border-neutral-700/60 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 hover:bg-slate-100/80 dark:hover:bg-neutral-800/50'
                )}
              >
                <ProjectAvatar name={project.name} image={project.imageUrl} className="size-5 shrink-0" />
                <span className="truncate">{project.name}</span>
              </div>
            </Link>
          );
        })}

        {data?.documents.length === 0 && (
          <p className="text-xs text-muted-foreground px-3 py-2 italic">
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
};
