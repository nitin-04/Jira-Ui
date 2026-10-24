import Image from 'next/image';
import Link from 'next/link';
import { DottedSeparator } from './dotted-separator';
import { Navigation } from './navigation';
import { WorkspaceSwitcher } from './workspace-switcher';
import { Projects } from './projects';

export const Sidebar = () => {
  return (
    <aside className="h-full bg-white dark:bg-neutral-900 border-r border-border/80 p-4 w-full flex flex-col overflow-y-auto">
      <Link href="/" className="flex items-center gap-2.5 px-2 py-1 group">
        <div className="size-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center p-1">
          <Image src="/logo.svg" alt="Logo" width={22} height={28} className="w-auto h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-foreground leading-none">
            Jira
          </span>
          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">
            Cloud
          </span>
        </div>
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
