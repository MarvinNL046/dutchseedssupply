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
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user role:', userError);
        
        // If the user is marvinsmit1988@gmail.com or admin@dutchseedsupply.com, treat as admin
        if (data.user.email === 'marvinsmit1988@gmail.com' || 
            data.user.email === 'admin@dutchseedsupply.com') {
          console.log('Using email check for known admin');
          const response = NextResponse.json({ 
            user: data.user,
            isAdmin: true,
            redirectTo: '/admin'
          });
          
          // Log session data for debugging
          console.log('Session data for known admin (email check):', data.session);
          
          return response;
        }
      } else if (user?.role === 'admin') {
        console.log('Admin role confirmed from database');
        const response = NextResponse.json({ 
          user: data.user,
          isAdmin: true,
          redirectTo: '/admin'
        });
        
        // Log session data for debugging
        console.log('Session data for admin user:', data.session);
        
        return response;
      }
      
      // Regular user
      const response = NextResponse.json({ 
        user: data.user,
        isAdmin: false,
        redirectTo: '/dashboard/'
      });
      
      // Log session data for debugging
      console.log('Session data for regular user:', data.session);
      
      return response;
    } catch (innerError) {
      console.error('Error checking user role:', innerError);
      
      // Fallback for known admin email
      if (data.user.email === 'marvinsmit1988@gmail.com' || 
          data.user.email === 'admin@dutchseedsupply.com') {
        console.log('Using email fallback for known admin after error');
        const response = NextResponse.json({ 
          user: data.user,
          isAdmin: true,
          redirectTo: '/admin'
        });
        
        // Log session data for debugging
        console.log('Session data for known admin (fallback):', data.session);
        
        return response;
      }
      
      // Return user data anyway
      const response = NextResponse.json({ 
        user: data.user,
        isAdmin: false,
        redirectTo: '/dashboard/'
      });
      
      // Log session data for debugging
      console.log('Session data for regular user (fallback):', data.session);
      
      return response;
    }
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
