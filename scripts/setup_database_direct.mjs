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

async function setupDatabaseDirect() {
  console.log('Starting database setup using direct API calls...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // 1. Create the profiles table using the REST API
    console.log('\n--- Creating profiles table ---');
    
    // We'll use the REST API to create the profiles table
    // First, let's check if the profiles table already exists
    const { error: tablesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (tablesError && tablesError.code === '42P01') {
      console.log('Profiles table does not exist. Creating it...');
      
      // We need to use the Supabase Dashboard SQL Editor to create the table
      console.log(`
        Please run the following SQL in the Supabase Dashboard SQL Editor:
        
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          role TEXT DEFAULT 'user',
          loyalty_points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Policy for admins (can do anything with all profiles)
        CREATE POLICY admin_all_profiles ON public.profiles
          FOR ALL
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
          );

        -- Policy for users (can read their own data)
        CREATE POLICY users_read_own_profile ON public.profiles
          FOR SELECT
          TO authenticated
          USING (id = auth.uid());

        -- Policy for users (can update their own data except role)
        CREATE POLICY users_update_own_profile ON public.profiles
          FOR UPDATE
          TO authenticated
          USING (id = auth.uid())
          WITH CHECK (id = auth.uid() AND role = 'user');

        -- Policy for service role (can do anything)
        CREATE POLICY service_role_all_profiles ON public.profiles
          FOR ALL
          TO service_role
          USING (true);
          
        -- Create the handle_new_user function
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, role, loyalty_points)
          VALUES (new.id, new.email, 'user', 0);
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create the trigger
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `);
      
      // Wait for the user to confirm they've run the SQL
      console.log('\nHave you run the SQL in the Supabase Dashboard? (y/n)');
      const readline = (await import('readline')).createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('Aborting setup. Please run the SQL and try again.');
        return;
      }
      
      console.log('Continuing with setup...');
    } else if (tablesError) {
      console.error('Error checking if profiles table exists:', tablesError);
    } else {
      console.log('Profiles table already exists.');
    }
    
    // 2. Create an admin user
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
    
    // 3. Test creating a regular user
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
    
    console.log('\nDatabase setup completed!');
    console.log('\nAdmin user credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('\nTest user credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
  } catch (error) {
    console.error('Unexpected error during database setup:', error);
  }
}

// Run the function
setupDatabaseDirect();
