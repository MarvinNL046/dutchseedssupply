import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Sign out
    await supabase.auth.signOut();
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Error in logout API:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
