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
            return request.cookies.get(name)?.value
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
            // Gebruik options bij het verwijderen van cookies
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
