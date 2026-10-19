import { Hono } from 'hono';

import auth from '@/features/auth/server/route';
import workspaces from '@/features/workspaces/server/route';
import members from '@/features/members/server/route';
import projects from '@/features/projects/server/route';
import tasks from '@/features/tasks/server/route';

const app = new Hono().basePath('/api');

const routes = app
  .route('/auth', auth)
  .route('/workspaces', workspaces)
  .route('/members', members)
  .route('/projects', projects)
  .route('/tasks', tasks);

export const GET = (req: Request) => app.fetch(req);
export const POST = (req: Request) => app.fetch(req);
export const PUT = (req: Request) => app.fetch(req);
export const PATCH = (req: Request) => app.fetch(req);
export const DELETE = (req: Request) => app.fetch(req);
export const HEAD = (req: Request) => app.fetch(req);
export const OPTIONS = (req: Request) => app.fetch(req);

export type AppType = typeof routes;
