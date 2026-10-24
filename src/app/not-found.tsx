import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col gap-y-4 items-center justify-center bg-background text-foreground">
      <AlertTriangle className="size-8 text-amber-500" />
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button asChild variant="primary" size="sm">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
