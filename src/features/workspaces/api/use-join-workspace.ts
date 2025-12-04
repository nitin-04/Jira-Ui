import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';
import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[':workspaceId']['join']['$post'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[':workspaceId']['join']['$post']
>;

export const useJoinWorkspace = () => {
  //   const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[':workspaceId']['join'][
        '$post'
      ]({
        param,
        json,
      });
      if (!response.ok) {
        throw new Error('Failed to join workspace.');
      }
      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success('joined workspace successfully');
      //   router.refresh();
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace', data.$id] });
    },
    onError: (error) => {
      // toast.error('Failed to join workspace');
      toast.error(error.message);
    },
  });
  return mutation;
};
