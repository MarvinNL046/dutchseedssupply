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

async function updateUserRegistrationTrigger() {
  console.log('Updating user registration trigger...');

  try {
    // Drop the existing trigger and function
    const { error: dropTriggerError } = await supabase.rpc('execute_sql', {
      sql_query: 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;'
    });

    if (dropTriggerError) {
      console.error('Error dropping trigger:', dropTriggerError);
      return;
    }

    const { error: dropFunctionError } = await supabase.rpc('execute_sql', {
      sql_query: 'DROP FUNCTION IF EXISTS public.handle_new_user();'
    });

    if (dropFunctionError) {
      console.error('Error dropping function:', dropFunctionError);
      return;
    }

    // Create new function that inserts into profiles table
    const createFunctionQuery = `
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, role, loyalty_points)
      VALUES (new.id, new.email, 'user', 0);
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: createFunctionError } = await supabase.rpc('execute_sql', {
      sql_query: createFunctionQuery
    });

    if (createFunctionError) {
      console.error('Error creating function:', createFunctionError);
      return;
    }

    // Create new trigger
    const createTriggerQuery = `
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;

    const { error: createTriggerError } = await supabase.rpc('execute_sql', {
      sql_query: createTriggerQuery
    });

    if (createTriggerError) {
      console.error('Error creating trigger:', createTriggerError);
      return;
    }

    // Verify the trigger was created
    const { data, error: verifyError } = await supabase.rpc('execute_sql', {
      sql_query: "SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';"
    });

    if (verifyError) {
      console.error('Error verifying trigger:', verifyError);
      return;
    }

    console.log('User registration trigger updated successfully!');
    console.log('Trigger verification:', data);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateUserRegistrationTrigger();
