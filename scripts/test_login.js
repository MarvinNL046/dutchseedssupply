// This script tests logging in with the admin user
// Run with: node scripts/test_login.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('Testing login with admin user...');
    
    // Try to sign in with the admin user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'marvinsmit1988@gmail.com',
      password: 'Admin123!'
    });
    
    if (error) {
      console.error('Error signing in:', error);
    } else {
      console.log('Sign in successful:', data);
      
      // Check if the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
      } else {
        console.log('User data:', userData);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin();
