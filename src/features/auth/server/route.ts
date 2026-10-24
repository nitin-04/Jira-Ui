import { Hono } from 'hono';
import { AppwriteException, ID } from 'node-appwrite';
import { zValidator } from '@hono/zod-validator';
import { deleteCookie, setCookie } from 'hono/cookie';

import { createAdminClient } from '@/lib/appwrite';

import { loginSchema, registerSchema } from '../schemas';
import { AUTH_COOKIE } from '../constants';
import { sessionMiddleware } from '@/lib/session-middleware';

const app = new Hono()

  .get('/current', sessionMiddleware, async (c) => {
    const user = c.get('user');
    return c.json({ data: user });
  })

  .post('/login', zValidator('json', loginSchema), async (c) => {
    try {
      const { email, password } = c.req.valid('json');

      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    } catch (error) {
      const isAppwriteError = error instanceof AppwriteException;
      const isPasswordError =
        (isAppwriteError &&
          (error.code === 401 || error.type === 'user_invalid_credentials')) ||
        (error instanceof Error &&
          (error.message.toLowerCase().includes('credential') ||
            error.message.toLowerCase().includes('password')));

      const message = isPasswordError
        ? 'Incorrect password'
        : error instanceof Error
          ? error.message
          : 'Incorrect password';

      return c.json({ error: message }, 401);
    }
  })

  .post('/register', zValidator('json', registerSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid('json');

      const { account } = await createAdminClient();
      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : 'Failed to register' },
        400,
      );
    }
  })

  .post('/logout', sessionMiddleware, async (c) => {
    const account = c.get('account');

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession('current');

    return c.json({ success: true });
  });

export default app;
