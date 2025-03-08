import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }
    
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error);
      return NextResponse.json({ 
        error: error.message 
      }, { status: 401 });
    }
    
    // Check if user is admin
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user role:', userError);
        
        // If the user is marvinsmit1988@gmail.com, treat as admin
        if (data.user.email === 'marvinsmit1988@gmail.com') {
          console.log('Using email check for known admin');
          return NextResponse.json({ 
            user: data.user,
            isAdmin: true,
            redirectTo: '/admin'
          });
        }
      } else if (user?.role === 'admin') {
        console.log('Admin role confirmed from database');
        return NextResponse.json({ 
          user: data.user,
          isAdmin: true,
          redirectTo: '/admin'
        });
      }
      
      // Regular user
      return NextResponse.json({ 
        user: data.user,
        isAdmin: false,
        redirectTo: '/'
      });
    } catch (innerError) {
      console.error('Error checking user role:', innerError);
      
      // Fallback for known admin email
      if (data.user.email === 'marvinsmit1988@gmail.com') {
        console.log('Using email fallback for known admin after error');
        return NextResponse.json({ 
          user: data.user,
          isAdmin: true,
          redirectTo: '/admin'
        });
      }
      
      // Return user data anyway
      return NextResponse.json({ 
        user: data.user,
        isAdmin: false,
        redirectTo: '/'
      });
    }
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
