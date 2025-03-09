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

async function updateTriggerFunction() {
  console.log('Updating trigger function...');

  try {
    // Check if profiles table exists
    const { data: profilesExists, error: profilesExistsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles'
        ) AS profiles_table_exists;
      `
    });

    if (profilesExistsError) {
      console.error('Error checking if profiles table exists:', profilesExistsError);
      return;
    }

    console.log('Profiles table exists check result:', profilesExists);

    if (!profilesExists || !profilesExists[0]?.profiles_table_exists) {
      console.error('Profiles table does not exist. Please create it first.');
      return;
    }

    // Check if loyalty_points column exists in profiles table
    const { data: loyaltyPointsExists, error: loyaltyPointsExistsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'profiles'
          AND column_name = 'loyalty_points'
        ) AS loyalty_points_exists;
      `
    });

    if (loyaltyPointsExistsError) {
      console.error('Error checking if loyalty_points column exists:', loyaltyPointsExistsError);
      return;
    }

    console.log('Loyalty points column exists check result:', loyaltyPointsExists);

    // Add loyalty_points column if it doesn't exist
    if (!loyaltyPointsExists || !loyaltyPointsExists[0]?.loyalty_points_exists) {
      console.log('Adding loyalty_points column to profiles table...');
      
      const { error: addColumnError } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE public.profiles
          ADD COLUMN loyalty_points INTEGER DEFAULT 0;
        `
      });
      
      if (addColumnError) {
        console.error('Error adding loyalty_points column:', addColumnError);
        return;
      }
      
      console.log('Loyalty points column added successfully!');
    }

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

    // Verify the trigger was created
    const { data: verifyTrigger, error: verifyTriggerError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
      `
    });
    
    if (verifyTriggerError) {
      console.error('Error verifying trigger:', verifyTriggerError);
      return;
    }
    
    console.log('Trigger verification:', verifyTrigger);

    console.log('Trigger function update completed successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateTriggerFunction();
