// This script creates a test user in Supabase
// Run with: node scripts/create_test_user.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

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

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Create a test user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'Test123!',
      email_confirm: true
    });
    
    if (userError) {
      console.error('Error creating user:', userError);
    } else {
      console.log('User created:', userData);
      
      // Insert the user into the users table with admin role
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert([
          { id: userData.user.id, email: 'test@example.com', role: 'admin', loyalty_points: 0 }
        ]);
      
      if (insertError) {
        console.error('Error inserting user into users table:', insertError);
      } else {
        console.log('User inserted into users table:', insertData);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestUser();
