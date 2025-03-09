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

async function createUsers() {
  console.log('Starting user creation...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // 1. Create an admin user
    console.log('\n--- Creating admin user ---');
    
    const adminEmail = 'admin@dutchseedsupply.com';
    const adminPassword = 'Admin123!';
    
    // Create the admin user in auth.users
    const { data: adminUser, error: createAdminError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });
    
    if (createAdminError) {
      console.error('Error creating admin user:', createAdminError);
    } else {
      console.log('Admin user created successfully:', adminUser.user.id);
      
      // Update the admin user's role in the profiles table
      const { error: updateAdminError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.user.id);
      
      if (updateAdminError) {
        console.error('Error updating admin role:', updateAdminError);
      } else {
        console.log('Admin role updated successfully.');
      }
    }
    
    // 2. Create a test user
    console.log('\n--- Creating test user ---');
    
    const testEmail = 'test@dutchseedsupply.com';
    const testPassword = 'Test123!';
    
    // Create the test user in auth.users
    const { data: testUser, error: createTestError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    if (createTestError) {
      console.error('Error creating test user:', createTestError);
    } else {
      console.log('Test user created successfully:', testUser.user.id);
      
      // Check if the test user has a profile
      const { data: testProfile, error: testProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUser.user.id);
      
      if (testProfileError) {
        console.error('Error checking test user profile:', testProfileError);
      } else if (!testProfile || testProfile.length === 0) {
        console.error('Test user profile was not created automatically. The trigger may not be working.');
      } else {
        console.log('Test user profile created successfully:', testProfile);
      }
    }
    
    console.log('\nUser creation completed!');
    console.log('\nAdmin user credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nTest user credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
  } catch (error) {
    console.error('Unexpected error during user creation:', error);
  }
}

// Run the function
createUsers();
