'use client';

import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from './mobile-sidebar';
import { ModeToggle } from './mode-toggle';
import { usePathname } from 'next/navigation';

const pathnameMap = {
  tasks: {
    title: 'My Tasks',
    description: 'View all of your tasks here',
  },
  projects: {
    title: 'My Project',
    description: 'View tasks of your project here',
  },
  settings: {
    title: 'Settings',
    description: 'Manage workspace configuration and preferences',
  },
  members: {
    title: 'Members',
    description: 'Manage workspace members and roles',
  },
};

const defaultMap = {
  title: 'Home',
  description: 'Monitor all your projects and tasks here',
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between border-b pb-4 border-border/40">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <UserButton />
      </div>
    </nav>
  );
};
