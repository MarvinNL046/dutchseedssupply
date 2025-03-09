'use server'

// Server actions voor login, registratie en logout functionaliteit
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // Check if user is admin
  try {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!userError) {
      if (user?.role === 'admin') {
        return redirect('/admin')
      } else if (user?.role === 'user') {
        return redirect('/dashboard/')
      }
    }

    // Fallback for known admin email
    if (data.user.email === 'marvinsmit1988@gmail.com') {
      return redirect('/admin')
    }
  } catch (err) {
    console.error('Error checking user role:', err)
    
    // Fallback for known admin
    if (data.user.email === 'marvinsmit1988@gmail.com') {
      return redirect('/admin')
    }
  }

  // Default fallback
  return redirect('/dashboard/')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
        data: {
          full_name: formData.get('name') as string || '',
        }
      },
    })

    if (error) {
      console.error('Signup error:', error)
      return redirect('/register?error=' + encodeURIComponent(error.message))
    }

    // Manually insert the user into the public.profiles table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            email: data.user.email, 
            role: 'user',
            loyalty_points: 0
          }
        ])

      if (insertError) {
        console.error('Error inserting user into public.profiles table:', insertError)
        // Continue anyway, as the user was created in auth.users
      }
    }

    return redirect('/dashboard/?message=Account aangemaakt. Je kunt nu gebruik maken van je dashboard.')
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return redirect('/register?error=Er is een onverwachte fout opgetreden bij het registreren.')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}
