import Image from 'next/image';
import Link from 'next/link';
import { DottedSeparator } from './dotted-separator';
import { Navigation } from './navigation';
import { WorkspaceSwitcher } from './workspace-switcher';
import { Projects } from './projects';

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100/70 dark:bg-neutral-900 border-r border-border/70 p-4 w-full flex flex-col overflow-y-auto">
      <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
        <Image src="/logo.svg" alt="Logo" width={28} height={36} className="w-auto h-7" />
        <span className="font-bold text-xl tracking-tight text-foreground">Jira</span>
      </Link>
      <DottedSeparator className="my-4" />

      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
