'use client';
import { Button } from '@/components/ui/button';
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
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={56}
            className="mb-8"
          />
          <Button asChild variant="secondary">
            <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
              {isSignIn ? 'Sign Up' : 'Login'}
            </Link>
          </Button>
        </nav>
        <div className="flex items-center flex-col justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
