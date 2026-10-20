// src/lib/server/oauth.js
'use server';

import crypto from 'node:crypto';
import { createAdminClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { OAuthProvider } from 'node-appwrite';

export async function signUpWithGithub() {
  const { account } = await createAdminClient();

  const origin = (await headers()).get('origin');

  const redirectUrl = await account.createOAuth2Token({
    provider: OAuthProvider.Github,
    success: `${origin}/oauth`,
    failure: `${origin}/sign-up`,
  });

  return redirect(redirectUrl);
}
