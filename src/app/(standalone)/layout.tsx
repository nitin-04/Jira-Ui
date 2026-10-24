import { UserButton } from '@/features/auth/components/user-button';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';
import Link from 'next/link';

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-slate-50/70 dark:bg-neutral-950 min-h-screen text-foreground transition-colors">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[72px] border-b border-border/60 pb-3">
          <Link href="/" className="flex items-center gap-2.5">
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
          <div className="flex items-center gap-x-3">
            <ModeToggle />
            <UserButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-8">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
