'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { updateWorkspaceSchema } from '../schemas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DottedSeparator } from '@/components/dotted-separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  ImageIcon,
  RefreshCwIcon,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Workspace } from '../types';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteWorkspace } from '../api/use-delete-workspace';
import { toast } from 'sonner';
import { useResetInviteCode } from '../api/use-reset-invite-code';
import { useState } from 'react';

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { mutate, isPending } = useUpdateWorkspace();

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Workspace',
    'Are you sure you want to delete this workspace? This action cannot be undone.',
    'destructive',
  );

  const [ResetDialog, confirmReset] = useConfirm(
    'Reset invite link',
    'This will invalidate the current invite link. Existing members will remain.',
    'destructive',
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const sanitizedImageUrl =
    initialValues.imageUrl &&
    initialValues.imageUrl !== 'undefined' &&
    initialValues.imageUrl !== 'null'
      ? initialValues.imageUrl
      : '';

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: sanitizedImageUrl,
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push('/');
        },
      },
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode({
      param: { workspaceId: initialValues.$id },
    });
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };
    mutate({
      form: finalValues,
      param: {
        workspaceId: initialValues.$id,
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const fullInviteLink = `${origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    if (!fullInviteLink) return;
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      setCopied(true);
      toast.success('Invite link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-y-6 w-full">
      <DeleteDialog />
      <ResetDialog />

      {/* Main General Settings Card */}
      <Card className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-x-4 mb-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-semibold gap-x-1.5"
              onClick={
                onCancel
                  ? onCancel
                  : () => router.push(`/workspaces/${initialValues.$id}`)
              }
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>Back</span>
            </Button>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">
                {initialValues.name}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-xs">
            Manage your workspace configuration, name, and visual branding.
          </CardDescription>
        </CardHeader>
        <div className="px-6">
          <DottedSeparator />
        </div>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                        className="bg-slate-50/70 dark:bg-neutral-800/80 border-slate-200/80 dark:border-neutral-700/80 font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <FormLabel className="text-xs font-semibold">Workspace Icon</FormLabel>
                    <div className="flex items-center gap-x-4 p-3 rounded-lg border border-slate-200/80 dark:border-neutral-800 bg-slate-50/40 dark:bg-neutral-900/40">
                      {field.value &&
                      field.value !== 'undefined' &&
                      field.value !== 'null' ? (
                        <div className="size-14 relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-neutral-700 shrink-0 shadow-2xs">
                          <Image
                            alt="logo"
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-14 rounded-xl border border-slate-200/80 dark:border-neutral-700 shrink-0">
                          <AvatarFallback className="bg-blue-600 font-bold text-white text-lg">
                            {initialValues.name[0]?.toUpperCase() ?? <ImageIcon className="size-6 text-white" />}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">Upload workspace branding</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          JPG, PNG, or SVG up to 1MB recommended.
                        </p>

                        <Input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .jpeg, .svg"
                          ref={inputRef}
                          onChange={handleImageChange}
                          disabled={isPending}
                        />

                        <div className="flex items-center gap-x-2 mt-2">
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="secondary"
                            size="xs"
                            className="text-xs font-semibold"
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                          {field.value &&
                            field.value !== 'undefined' &&
                            field.value !== 'null' && (
                              <Button
                                type="button"
                                disabled={isPending}
                                variant="ghost"
                                size="xs"
                                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                onClick={() => {
                                  field.onChange('');
                                  if (inputRef.current) {
                                    inputRef.current.value = '';
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />

              <div className="pt-2">
                <DottedSeparator className="mb-5" />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && 'invisible')}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={isPending}
                    className="font-semibold text-xs ml-auto shadow-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Invite Members Card */}
      <Card className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-bold tracking-tight">Invite Members</CardTitle>
          <CardDescription className="text-xs">
            Share this link with teammates to invite them directly into this workspace.
          </CardDescription>
        </CardHeader>
        <div className="px-6">
          <DottedSeparator />
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-x-2">
            <Input
              readOnly
              value={fullInviteLink}
              className="bg-slate-50/70 dark:bg-neutral-800/80 border-slate-200/80 dark:border-neutral-700/80 font-mono text-xs text-slate-700 dark:text-neutral-300"
            />
            <Button
              onClick={handleCopyInviteLink}
              variant="secondary"
              size="sm"
              className="h-10 px-3 shrink-0 gap-x-1.5 text-xs font-semibold"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-4 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              If an invite link has been exposed, reset it immediately.
            </p>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
              className="h-8 text-xs font-semibold gap-x-1.5 shrink-0 hover:bg-slate-50 dark:hover:bg-neutral-800"
            >
              <RefreshCwIcon className={cn('size-3.5', isResettingInviteCode && 'animate-spin')} />
              <span>Reset invite link</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="bg-rose-50/30 dark:bg-rose-950/15 border border-rose-200/80 dark:border-rose-900/40 rounded-xl shadow-xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col space-y-1">
              <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200">Danger Zone</h3>
              <p className="text-xs text-rose-700/90 dark:text-rose-300/80 max-w-md">
                Deleting a workspace is irreversible and will permanently remove all associated projects, tasks, and member records.
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
              className="shrink-0 gap-x-1.5 text-xs font-semibold"
            >
              <TrashIcon className="size-3.5" />
              <span>Delete Workspace</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
