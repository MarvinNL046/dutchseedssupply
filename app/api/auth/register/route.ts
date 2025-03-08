import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
        data: {
          full_name: name || '',
        }
      },
    });
    
    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ 
        error: error.message 
      }, { status: 400 });
    }
    
    // Manually insert the user into the public.users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { 
            id: data.user.id, 
            email: data.user.email, 
            role: 'user',
            loyalty_points: 0
          }
        ]);
      
      if (insertError) {
        console.error('Error inserting user into public.users table:', insertError);
        // Continue anyway, as the user was created in auth.users
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Controleer je e-mail om je account te bevestigen.',
      user: data.user
    });
  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
