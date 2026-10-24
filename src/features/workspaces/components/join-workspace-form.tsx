'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { WorkspaceAvatar } from './workspace-avatar';
import { Loader, UserPlus } from 'lucide-react';

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
    imageUrl?: string;
  };
}

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="p-6 sm:p-7">
        <div className="flex items-center gap-x-3 mb-2">
          <WorkspaceAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-10 rounded-lg text-sm"
          />
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
              Join Workspace
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
              You&apos;ve been invited to collaborate
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 sm:px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-6 sm:p-7 space-y-6">
        <p className="text-sm text-slate-600 dark:text-neutral-300">
          You are invited to join <span className="font-semibold text-slate-900 dark:text-white">{initialValues.name}</span>. As a member, you will be able to view and manage tasks, collaborate with team members, and track project progress.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            type="button"
            asChild
            size="lg"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="primary"
            size="lg"
            type="button"
            disabled={isPending}
            onClick={onSubmit}
          >
            {isPending ? (
              <Loader className="size-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="size-4 mr-2" />
            )}
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
