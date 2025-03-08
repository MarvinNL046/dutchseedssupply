// This script checks if the admin user exists in Supabase
// Run with: node --experimental-modules scripts/check_admin_user.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdminUser() {
  try {
    console.log('Checking for admin user in auth.users...');
    
    // Check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error listing users:', authError);
      process.exit(1);
    }
    
    // Find the user with the email marvinsmit1988@gmail.com
    const adminUser = authUsers.users.find(user => user.email === 'marvinsmit1988@gmail.com');
    
    if (!adminUser) {
      console.log('Admin user not found in auth.users');
    } else {
      console.log('Admin user found in auth.users:', adminUser);
      
      // Check if user exists in public.users
      console.log('Checking for admin user in public.users...');
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('id', adminUser.id)
        .single();
      
      if (publicError) {
        console.error('Error fetching user from public.users:', publicError);
        console.log('Admin user not found in public.users');
      } else {
        console.log('Admin user found in public.users:', publicUser);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminUser();
