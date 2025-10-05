import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Children } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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
          {/* <div className="flex items-center gap-4"> */}
          <Button variant="secondary">Sign Up</Button>
          {/* </div> */}
        </nav>
        <div className="flex items-center flex-col justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
