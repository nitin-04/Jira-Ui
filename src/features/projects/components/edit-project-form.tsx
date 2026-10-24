'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  ImageIcon,
  TrashIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Project } from '../types';
import { useUpdateProject } from '../api/use-update-project';
import { updateProjectSchema } from '../schemas';
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteProject } from '../api/use-delete-project';

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValues,
}: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();

  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete project',
    'Are you sure you want to delete this project? All associated tasks will be removed.',
    'destructive',
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const sanitizedImageUrl =
    initialValues.imageUrl &&
    initialValues.imageUrl !== 'undefined' &&
    initialValues.imageUrl !== 'null'
      ? initialValues.imageUrl
      : '';

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: sanitizedImageUrl,
    },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteProject(
      {
        param: { projectId: initialValues.$id },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialValues.workspaceId}`);
        },
      },
    );
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };
    mutate({
      form: finalValues,
      param: {
        projectId: initialValues.$id,
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 w-full">
      <DeleteDialog />

      {/* Main Project Details Card */}
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
                  : () =>
                      router.push(
                        `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                      )
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
            Manage project details, icon, and configurations.
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
                    <FormLabel className="text-xs font-semibold">Project Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter project name"
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
                    <FormLabel className="text-xs font-semibold">Project Icon</FormLabel>
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
                        <p className="text-xs font-medium text-foreground">Upload project avatar</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          JPG, PNG, or SVG up to 1MB.
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

      {/* Danger Zone Card */}
      <Card className="bg-rose-50/30 dark:bg-rose-950/15 border border-rose-200/80 dark:border-rose-900/40 rounded-xl shadow-xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col space-y-1">
              <h3 className="font-bold text-sm text-rose-900 dark:text-rose-200">Danger Zone</h3>
              <p className="text-xs text-rose-700/90 dark:text-rose-300/80 max-w-md">
                Deleting a project is irreversible and will remove all associated tasks and sprint records.
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending || isDeletingProject}
              onClick={handleDelete}
              className="shrink-0 gap-x-1.5 text-xs font-semibold"
            >
              <TrashIcon className="size-3.5" />
              <span>Delete Project</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
