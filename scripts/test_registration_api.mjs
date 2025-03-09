import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗');
  process.exit(1);
}

// Create Supabase client with anon key (simulating a frontend request)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRegistration() {
  console.log('Testing registration functionality...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // Generate a unique email to avoid conflicts
    const timestamp = new Date().getTime();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'Test123!';
    
    console.log(`\nAttempting to register user with email: ${testEmail}`);
    
    // Sign up a new user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError) {
      console.error('Error during sign up:', signUpError);
      return;
    }
    
    console.log('Sign up successful!');
    console.log('User ID:', signUpData.user.id);
    
    // Wait a moment for the trigger to execute
    console.log('\nWaiting for trigger to execute...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a new client with the service role key to check the profiles table
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Check if a profile was created for the new user
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', signUpData.user.id);
    
    if (profileError) {
      console.error('Error checking profile:', profileError);
      return;
    }
    
    if (!profile || profile.length === 0) {
      console.error('Profile was not created for the new user. The trigger may not be working.');
      return;
    }
    
    console.log('\nProfile was created successfully!');
    console.log('Profile data:', profile[0]);
    
    // Verify that loyalty_points is set to 0
    if (profile[0].loyalty_points !== 0) {
      console.error('Loyalty points is not set to 0:', profile[0].loyalty_points);
    } else {
      console.log('Loyalty points is correctly set to 0.');
    }
    
    console.log('\nRegistration test completed successfully!');
    console.log('\nTest user credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
  } catch (error) {
    console.error('Unexpected error during registration test:', error);
  }
}

// Run the function
testRegistration();
