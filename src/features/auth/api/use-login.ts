import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';
import { Infer } from 'zod';

type ResponseType = InferResponseType<typeof client.api.auth.login>;
type RequestType = InferRequestType<typeof client.api.auth.login>;

export type LoginResponse = Infer<ResponseType>;
