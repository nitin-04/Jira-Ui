// src/app/oauth/route.js

import { AUTH_COOKIE } from '@/features/auth/constants';
import { createAdminClient } from '@/lib/appwrite';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');
  const state = request.nextUrl.searchParams.get('state');

  if (!userId || !secret) {
    return new NextResponse('Missing Fields', { status: 400 });
  }
  // Only accept a sign-in this browser started
  const cookieStore = await cookies();
  const expected = cookieStore.get('oauth-state')?.value;
  cookieStore.delete('oauth-state');

  const { account } = await createAdminClient();
  const session = await account.createSession({
    userId,
    secret,
  });

  cookieStore.set(AUTH_COOKIE, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
