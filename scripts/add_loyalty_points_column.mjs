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

async function addLoyaltyPointsColumn() {
  console.log('Adding loyalty_points column to profiles table...');

  try {
    // Add loyalty_points column to profiles table if it doesn't exist
    console.log('Adding loyalty_points column if it doesn\'t exist...');
    
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

    // Update the handle_new_user function to include loyalty_points
    console.log('Updating handle_new_user function to include loyalty_points...');
    
    const { error: updateFunctionError } = await supabase.rpc('execute_sql', {
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
    
    if (updateFunctionError) {
      console.error('Error updating handle_new_user function:', updateFunctionError);
      return;
    }
    
    console.log('handle_new_user function updated successfully!');

    // Check if the trigger exists
    console.log('Checking if the trigger exists...');
    
    const { data: triggerExists, error: triggerExistsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM pg_trigger
          WHERE tgname = 'on_auth_user_created'
        ) AS trigger_exists;
      `
    });
    
    if (triggerExistsError) {
      console.error('Error checking if trigger exists:', triggerExistsError);
      return;
    }
    
    console.log('Trigger exists check result:', triggerExists);

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

    // Update the register API route to handle the loyalty_points column
    console.log('Updating the register API route...');
    
    console.log('Loyalty points column added and trigger updated successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
addLoyaltyPointsColumn();
