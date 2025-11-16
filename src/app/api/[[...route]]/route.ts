import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import auth from '@/features/auth/server/route';
const app = new Hono().basePath('/api');

const routes = app.route('/auth', auth);

export type AppType = typeof routes;

// --- THIS IS THE FIX ---
// You must export all of them!

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);
