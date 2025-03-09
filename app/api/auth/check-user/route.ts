import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create regular client for session check
    const supabase = await createServerSupabaseClient();
    
    // Check session
    const { data, error: sessionError } = await supabase.auth.getSession();
    const session = data.session;
    
    if (sessionError || !session) {
      console.log('No session found in user check API');
      return NextResponse.json({ 
        isAuthenticated: false, 
        message: 'Not authenticated' 
      }, { status: 401 });
    }
    
    try {
      // Check user in profiles table
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.log('Error fetching user role in user check API:', userError);
        return NextResponse.json({ 
          isAuthenticated: false, 
          message: 'Error fetching user data' 
        }, { status: 500 });
      }
      
      // User exists in profiles table
      console.log('User authenticated in user check API, role:', user?.role);
      return NextResponse.json({ 
        isAuthenticated: true, 
        role: user?.role || 'user',
        user: session.user,
        message: 'User authenticated' 
      });
      
    } catch (innerError) {
      console.error('Error checking user in user check API:', innerError);
      return NextResponse.json({ 
        isAuthenticated: false, 
        message: 'Error checking user status' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in user check API:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
