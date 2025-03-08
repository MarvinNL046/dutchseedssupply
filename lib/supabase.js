'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for server components
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        async set(name, value, options) {
          try {
            await cookieStore.set(name, value, options);
          } catch (error) {
            console.log('Cookie set error (safe to ignore):', error);
          }
        },
        async remove(name, options) {
          try {
            await cookieStore.delete(name, options);
          } catch (error) {
            console.log('Cookie remove error (safe to ignore):', error);
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client with admin privileges for server components
 * This uses the service role key and bypasses RLS
 * IMPORTANT: Only use this for admin operations
 */
export async function createServerSupabaseAdminClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        async get(name) {
          const cookie = await cookieStore.get(name);
          return cookie?.value;
        },
        async set(name, value, options) {
          try {
            await cookieStore.set(name, value, options);
          } catch (error) {
            console.log('Cookie set error (safe to ignore):', error);
          }
        },
        async remove(name, options) {
          try {
            await cookieStore.delete(name, options);
          } catch (error) {
            console.log('Cookie remove error (safe to ignore):', error);
          }
        },
      },
    }
  );
}

/**
 * Get the current domain ID from cookies
 */
export async function getDomainId() {
  const cookieStore = await cookies();
  const cookie = await cookieStore.get('DOMAIN_ID');
  return cookie?.value || 'com';
}

/**
 * Get the current locale from cookies
 */
export async function getLocale() {
  const cookieStore = await cookies();
  const cookie = await cookieStore.get('NEXT_LOCALE');
  return cookie?.value || 'en';
}

/**
 * Legacy function for Pages Router compatibility
 * @deprecated Use createServerSupabaseClient instead
 */
export async function getSupabase(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies[name],
        set: (name, value, options) => {
          const { maxAge, ...cookieOptions } = options;
          res.setHeader(
            'Set-Cookie',
            `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}; ${Object.keys(cookieOptions)
              .map((key) => `${key}=${cookieOptions[key]}`)
              .join('; ')}`
          );
        },
        remove: (name, options) => {
          res.setHeader(
            'Set-Cookie',
            `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; ${Object.keys(options)
              .map((key) => `${key}=${options[key]}`)
              .join('; ')}`
          );
        },
      },
    }
  );
}
