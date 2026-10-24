'use client';

import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberRole } from '@/features/members/types';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { DottedSeparator } from '@/components/dotted-separator';
import { useConfirm } from '@/hooks/use-confirm';
import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

import { ArrowLeftIcon, MoreVerticalIcon, ShieldCheck, User } from 'lucide-react';
import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetMembers({ workspaceId });
  const [ConfirmDialog, confirm] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member from the workspace?',
    'destructive'
  );
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember({
      param: { memberId },
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden w-full">
      <ConfirmDialog />
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-x-4 mb-2">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs font-semibold gap-x-1.5">
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftIcon className="size-3.5" />
              <span>Back</span>
            </Link>
          </Button>
          <CardTitle className="text-xl font-bold tracking-tight">Members List</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Manage team members, roles, and workspace permissions.
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <DottedSeparator />
      </div>
      <CardContent className="p-6">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center justify-between gap-x-3 py-2">
              <div className="flex items-center gap-x-3 min-w-0">
                <MemberAvatar
                  className="size-10"
                  fallbackClassName="text-sm font-bold"
                  name={member.name}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-x-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-foreground truncate">{member.name}</p>
                    <Badge
                      variant={member.role === MemberRole.ADMIN ? 'default' : 'outline'}
                      className="text-[10px] font-semibold py-0 px-1.5 h-4 shadow-none"
                    >
                      {member.role === MemberRole.ADMIN ? (
                        <>
                          <ShieldCheck className="size-2.5 mr-0.5" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="size-2.5 mr-0.5" />
                          Member
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="size-8 rounded-md" variant="ghost" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-48">
                  <DropdownMenuItem
                    className="font-medium text-xs py-2"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdatingMember || member.role === MemberRole.ADMIN}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-xs py-2"
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={isUpdatingMember || member.role === MemberRole.MEMBER}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-xs py-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isDeletingMember}
                  >
                    Remove from Workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2 bg-slate-100 dark:bg-neutral-800" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
