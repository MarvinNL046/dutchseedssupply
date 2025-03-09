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

async function dropUsersTable() {
  console.log('Dropping users table and ensuring profiles table is used...');

  try {
    // Check if users table exists
    console.log('\n--- Checking if users table exists ---');
    const { data: usersTable, error: usersTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        ) AS users_table_exists;
      `
    });

    if (usersTableError) {
      console.error('Error checking users table:', usersTableError);
    } else {
      console.log('Users table exists check result:', usersTable);
      
      // If users table exists, drop it
      if (usersTable && usersTable[0]?.users_table_exists) {
        console.log('Users table exists. Dropping it...');
        
        const { error: dropTableError } = await supabase.rpc('execute_sql', {
          sql_query: `
            DROP TABLE IF EXISTS public.users CASCADE;
          `
        });
        
        if (dropTableError) {
          console.error('Error dropping users table:', dropTableError);
        } else {
          console.log('Users table dropped successfully!');
        }
      } else {
        console.log('Users table does not exist. No need to drop it.');
      }
    }
    
    // Ensure profiles table exists with loyalty_points column
    console.log('\n--- Ensuring profiles table exists with loyalty_points column ---');
    const { error: createProfilesTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          role TEXT DEFAULT 'user',
          loyalty_points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });
    
    if (createProfilesTableError) {
      console.error('Error ensuring profiles table exists:', createProfilesTableError);
    } else {
      console.log('Profiles table exists or was created successfully!');
    }
    
    // Add loyalty_points column to profiles table if it doesn't exist
    const { error: addColumnError } = await supabase.rpc('execute_sql', {
      sql_query: `
        ALTER TABLE public.profiles
        ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
      `
    });
    
    if (addColumnError) {
      console.error('Error adding loyalty_points column to profiles table:', addColumnError);
    } else {
      console.log('loyalty_points column added to profiles table successfully (if it didn\'t exist)!');
    }
    
    // Update the handle_new_user function to use profiles table
    console.log('\n--- Updating handle_new_user function to use profiles table ---');
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
      console.error('Error creating/updating handle_new_user function:', createFunctionError);
    } else {
      console.log('handle_new_user function created/updated successfully!');
    }

    // Drop existing trigger if it exists
    const { error: dropTriggerError } = await supabase.rpc('execute_sql', {
      sql_query: 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;'
    });

    if (dropTriggerError) {
      console.error('Error dropping existing trigger:', dropTriggerError);
    } else {
      console.log('Existing trigger dropped successfully (if it existed).');
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
    } else {
      console.log('Trigger created successfully!');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
dropUsersTable();
