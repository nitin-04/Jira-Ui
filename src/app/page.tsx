'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrent } from '@/features/auth/api/use-current';
import { useLogout } from '@/features/auth/api/use-logout';
import { UserButton } from '@/features/auth/components/user-button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { createAdminClient } from '@/lib/appwrite';

export default function Home() {
  // console.log(createAdminClient, 'Hello');
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in');
    }
  }, [data]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
