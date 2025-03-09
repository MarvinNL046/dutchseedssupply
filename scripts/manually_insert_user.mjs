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

async function manuallyInsertUser() {
  console.log('Manually inserting a test user...');

  try {
    // First, create the user in auth.users
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

    // Now manually insert the user into the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authUser.user.id,
          email: email,
          role: 'user',
          loyalty_points: 0
        }
      ]);

    if (profileError) {
      console.error('Error inserting into profiles table:', profileError);
      return;
    }

    console.log('User inserted into profiles table successfully!');

    // Verify the user was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id);

    if (verifyError) {
      console.error('Error verifying user in profiles table:', verifyError);
      return;
    }

    console.log('User verified in profiles table:', verifyData);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
manuallyInsertUser();
