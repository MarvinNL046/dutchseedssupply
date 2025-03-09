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
    
    // Manually create a profile entry to handle the case where the trigger might fail
    if (data.user) {
      try {
        // First try with loyalty_points
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email || '',
            role: 'user',
            loyalty_points: 0
          });
        
        if (profileError) {
          // If there's an error with loyalty_points, it might be because the column doesn't exist
          if (profileError.message.includes('loyalty_points')) {
            console.log('Trying to create profile without loyalty_points column');
            
            // Try without loyalty_points
            const { error: profileError2 } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email || '',
                role: 'user'
              });
            
            if (profileError2) {
              console.error('Error creating profile without loyalty_points:', profileError2);
            }
          } else {
            console.error('Error creating profile:', profileError);
          }
        }
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
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
