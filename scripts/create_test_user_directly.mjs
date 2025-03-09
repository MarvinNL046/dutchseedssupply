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

async function createTestUserDirectly() {
  console.log('Creating test user directly...');

  try {
    // Create a test user
    const email = `test-${Date.now()}@example.com`;
    const password = 'Password123!';
    
    console.log(`Creating user with email: ${email}`);
    
    // Create user with admin API
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (userError) {
      console.error('Error creating user:', userError);
      return;
    }
    
    console.log('User created successfully:', userData.user);
    
    // Insert user into profiles table
    if (userData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userData.user.id, 
            email: userData.user.email, 
            role: 'user',
            loyalty_points: 0
          }
        ]);
      
      if (profileError) {
        console.error('Error inserting user into profiles table:', profileError);
      } else {
        console.log('User inserted into profiles table successfully!');
      }
    }
    
    console.log('Test user creation completed!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
createTestUserDirectly();
