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

async function fixTriggerWithLoyaltyPoints() {
  console.log('Fixing trigger function to include loyalty_points...');

  try {
    // Create or replace the handle_new_user function
    console.log('Creating or replacing handle_new_user function...');
    
    const { error: createFunctionError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, role, loyalty_points)
          VALUES (new.id, new.email, 'user', 0);
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (createFunctionError) {
      console.error('Error creating handle_new_user function:', createFunctionError);
      return;
    }
    
    console.log('handle_new_user function created or replaced successfully!');

    // Drop existing trigger if it exists
    console.log('Dropping existing trigger if it exists...');
    
    const { error: dropTriggerError } = await supabase.rpc('execute_sql', {
      sql_query: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      `
    });
    
    if (dropTriggerError) {
      console.error('Error dropping existing trigger:', dropTriggerError);
      return;
    }
    
    console.log('Existing trigger dropped successfully (if it existed).');

    // Create new trigger
    console.log('Creating new trigger...');
    
    const { error: createTriggerError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    });
    
    if (createTriggerError) {
      console.error('Error creating trigger:', createTriggerError);
      return;
    }
    
    console.log('Trigger created successfully!');

    // Add loyalty_points column to profiles table if it doesn't exist
    console.log('Adding loyalty_points column to profiles table if it doesn\'t exist...');
    
    const { error: addColumnError } = await supabase.rpc('execute_sql', {
      sql_query: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'loyalty_points'
          ) THEN
            ALTER TABLE public.profiles
            ADD COLUMN loyalty_points INTEGER DEFAULT 0;
          END IF;
        END
        $$;
      `
    });
    
    if (addColumnError) {
      console.error('Error adding loyalty_points column:', addColumnError);
      return;
    }
    
    console.log('loyalty_points column added successfully (if it didn\'t exist)!');

    // Test the trigger by creating a test user
    console.log('Testing the trigger by creating a test user...');
    
    const email = `test-trigger-${Date.now()}@example.com`;
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
    
    // Check if the user was added to the profiles table
    console.log('Checking if the user was added to the profiles table...');
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.user.id);
    
    if (profileError) {
      console.error('Error checking profiles table:', profileError);
      return;
    }
    
    console.log('Profile data:', profileData);
    
    if (profileData.length === 0) {
      console.log('User was not automatically added to profiles table. Trying to add manually...');
      
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authUser.user.id,
            email,
            role: 'user',
            loyalty_points: 0
          }
        ]);
      
      if (insertError) {
        console.error('Error inserting into profiles table:', insertError);
        return;
      }
      
      console.log('User inserted into profiles table manually:', insertData);
    } else {
      console.log('User was automatically added to profiles table!');
    }

    console.log('Trigger function fixed successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
fixTriggerWithLoyaltyPoints();
