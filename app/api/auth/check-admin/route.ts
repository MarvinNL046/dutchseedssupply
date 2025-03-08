import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create regular client for session check
    const supabase = await createServerSupabaseClient();
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.log('No session found in admin check API');
      return NextResponse.json({ 
        isAdmin: false, 
        message: 'Not authenticated' 
      }, { status: 401 });
    }
    
    try {
      // Create admin client for checking user role
      const adminSupabase = await createServerSupabaseAdminClient();
      
      // Check admin role with admin client
      const { data: user, error: userError } = await adminSupabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.log('Error fetching user role in admin check API:', userError);
        
        // If the user is marvinsmit1988@gmail.com, treat as admin
        if (session.user.email === 'marvinsmit1988@gmail.com') {
          console.log('Using email check for known admin in admin check API');
          return NextResponse.json({ 
            isAdmin: true, 
            message: 'Admin access granted (email fallback)' 
          });
        } else {
          console.log('User is not a known admin in admin check API');
          return NextResponse.json({ 
            isAdmin: false, 
            message: 'Not an admin user' 
          }, { status: 403 });
        }
      } else if (!user || user.role !== 'admin') {
        console.log('User is not admin in admin check API');
        return NextResponse.json({ 
          isAdmin: false, 
          message: 'Not an admin user' 
        }, { status: 403 });
      } else {
        console.log('Admin role confirmed from database in admin check API');
        return NextResponse.json({ 
          isAdmin: true, 
          message: 'Admin access granted' 
        });
      }
    } catch (innerError) {
      console.error('Error checking user role in admin check API:', innerError);
      
      // Fallback for known admin email
      if (session.user.email === 'marvinsmit1988@gmail.com') {
        console.log('Using email fallback for known admin after error in admin check API');
        return NextResponse.json({ 
          isAdmin: true, 
          message: 'Admin access granted (error fallback)' 
        });
      } else {
        console.log('User is not a known admin in admin check API, error fallback');
        return NextResponse.json({ 
          isAdmin: false, 
          message: 'Error checking admin status' 
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error in admin check API:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
