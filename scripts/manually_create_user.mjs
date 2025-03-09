import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function manuallyCreateUser() {
  console.log('Manually creating a user...');

  try {
    // Create a user in auth.users
    const email = `test-manual-${Date.now()}@example.com`;
    const password = 'Password123!';
    
    console.log(`Creating user with email: ${email}`);
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }
    
    console.log('Auth user created successfully:', authUser.user.id);
    
    // Manually insert a record into the profiles table
    console.log('Manually inserting a record into the profiles table...');
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authUser.user.id,
          email,
          role: 'user',
          loyalty_points: 0
        }
      ])
      .select();
    
    if (profileError) {
      console.error('Error inserting into profiles table:', profileError);
      
      // Try to get more details about the error
      const { data: errorDetails, error: errorDetailsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT pg_last_error() AS last_error;
        `
      });
      
      if (errorDetailsError) {
        console.error('Error getting error details:', errorDetailsError);
      } else {
        console.log('Error details:', errorDetails);
      }
      
      return;
    }
    
    console.log('Profile record inserted successfully:', profileData);
    
    // Verify the user was created
    console.log('Verifying the user was created...');
    
    const { data: verifyUser, error: verifyUserError } = await supabase.auth.admin.getUserById(
      authUser.user.id
    );
    
    if (verifyUserError) {
      console.error('Error verifying user:', verifyUserError);
      return;
    }
    
    console.log('User verified:', verifyUser.user);
    
    // Verify the profile was created
    console.log('Verifying the profile was created...');
    
    const { data: verifyProfile, error: verifyProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id);
    
    if (verifyProfileError) {
      console.error('Error verifying profile:', verifyProfileError);
      return;
    }
    
    console.log('Profile verified:', verifyProfile);
    
    console.log('User created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
manuallyCreateUser();
