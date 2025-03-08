import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    // Pass the full request to ensure the entire context is preserved
    const response = NextResponse.next(request)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = request.cookies.get(name)
            return cookie?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set cookies directly on the response with the correct format
            response.cookies.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
            // Remove cookies by setting with maxAge 0
            response.cookies.set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    await supabase.auth.getUser()

    return response
  } catch (error) {
    console.error('Error in updateSession:', error)
    // Return a basic response in case of error
    return NextResponse.next()
  }
}
