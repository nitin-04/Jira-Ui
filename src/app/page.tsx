// 'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { createAdminClient } from '@/lib/appwrite';

export default function Home() {
  // console.log(createAdminClient, 'Hello');

  return (
    <div className="flex gap-4">
      <Input />
      Type here
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="teritary">Teritary</Button>
    </div>
  );
}
