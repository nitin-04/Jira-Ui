'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === '/sign-in';

  return (
    <main className="bg-slate-50/70 dark:bg-neutral-950 min-h-screen text-foreground transition-colors">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-14 border-b border-border/50 pb-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center p-1">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={22}
                height={28}
                className="w-auto h-6"
              />
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
            <Button asChild variant="outline" size="sm" className="font-semibold">
              <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
                {isSignIn ? 'Sign Up' : 'Login'}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex items-center flex-col justify-center pt-6 md:pt-16">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
