import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { DATABASE_ID, WORKSPACES_ID } from '@/config';
import { sessionMiddleware } from '@/lib/session-middleware';

import { createWorkspaceSchema } from '../schemas';
import { ID } from 'node-appwrite';

const app = new Hono().post(
  '/',
  zValidator('json', createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databasese = c.get('databases');
    const user = c.get('user');

    const { name } = c.req.valid('json');

    const workspace = await databasese.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
      }
    );

    return c.json({ data: workspace });
  }
);

export default app;
