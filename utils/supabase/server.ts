import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = await cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          // This method must be called before any HTML is sent to the browser
          // https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
          try {
            await cookieStore.set(name, value, options)
          } catch (error) {
            // The `set` method was called after the response headers were sent.
            // We can ignore this error.
            console.log('Cookie set error (safe to ignore):', error)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            await cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            // The `delete` method was called after the response headers were sent.
            // We can ignore this error.
            console.log('Cookie remove error (safe to ignore):', error)
          }
        },
      },
    }
  )

  return supabase
}
