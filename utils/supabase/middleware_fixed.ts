import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: new Headers(request.headers)
      }
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              const cookie = request.cookies.get(name)?.value
              
              // If no cookie, return undefined
              if (!cookie) {
                return undefined;
              }
              
              // Special handling for base64 cookies to prevent JSON parsing
              if (cookie.startsWith('base64-')) {
                return cookie;
              }
              
              // For JSON cookies, only return if they're valid JSON
              if (cookie.startsWith('{')) {
                try {
                  // Test if it's valid JSON
                  JSON.parse(cookie);
                  return cookie;
                } catch (_) {
                  // Ignore the error and return the raw cookie value
                  console.warn(`Invalid JSON cookie for ${name}, returning raw value`);
                  return cookie;
                }
              }
              
              // For all other cookies, return as is
              return cookie;
            } catch (error) {
              console.error(`Error getting cookie ${name}:`, error);
              return undefined;
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: {
                headers: request.headers
              }
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.delete(name)
            response = NextResponse.next({
              request: {
                headers: request.headers
              }
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0
            })
          },
        },
      }
    )

    await supabase.auth.getUser()
    return response

  } catch (error) {
    console.error('Error in updateSession:', error)
    return NextResponse.next()
  }
}
