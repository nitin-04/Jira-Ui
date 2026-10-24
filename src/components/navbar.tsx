'use client';

import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from './mobile-sidebar';
import { ModeToggle } from './mode-toggle';
import { usePathname } from 'next/navigation';

const pathnameMap = {
  tasks: {
    title: 'My Tasks',
    description: 'Track and manage your workspace deliverables',
  },
  projects: {
    title: 'Project Overview',
    description: 'Monitor sprints, roadmaps, and progress',
  },
  settings: {
    title: 'Settings',
    description: 'Manage workspace configuration and preferences',
  },
  members: {
    title: 'Members',
    description: 'Manage workspace team members and roles',
  },
};

const defaultMap = {
  title: 'Workspace Dashboard',
  description: 'Monitor high-level project telemetry, sprints, and task progress',
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="py-4 px-6 flex items-center justify-between border-b border-border/80 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md sticky top-0 z-20 transition-colors">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
};
