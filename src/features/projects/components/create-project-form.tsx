'use client';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createProjectSchema } from '../schemas';
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
import { useCreateProject } from '../api/use-create-project';
import { useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();

  const inputRef = useRef<HTMLInputElement>(null);

  const formSchema = createProjectSchema.omit({ workspaceId: true });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
      image: values.image instanceof File ? values.image : '',
    };
    mutate(
      { form: finalValues },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onCancel?.();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">
          Create a new project
        </CardTitle>
        <CardDescription className="text-xs">
          Projects group tasks, track milestones, and manage sprints.
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
                      placeholder="e.g. Website Redesign, Mobile App, API"
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
                    {field.value ? (
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
                        <AvatarFallback className="bg-slate-100 dark:bg-neutral-800 text-slate-500">
                          <ImageIcon className="size-6" />
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
                        {field.value ? (
                          <Button
                            type="button"
                            disabled={isPending}
                            variant="destructive"
                            size="xs"
                            className="text-xs font-semibold"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = '';
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        ) : (
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
                  Create Project
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
