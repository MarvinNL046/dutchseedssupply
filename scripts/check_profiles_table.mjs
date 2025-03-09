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

async function checkProfilesTable() {
  console.log('Checking profiles table...');

  try {
    // Check if profiles table exists by trying to select from it
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('Error accessing profiles table:', profilesError);
      
      if (profilesError.message.includes('does not exist')) {
        console.log('The profiles table does not exist. Creating it...');
        
        // Create profiles table
        const { error: createTableError } = await supabase.rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              email TEXT NOT NULL,
              role TEXT DEFAULT 'user',
              loyalty_points INTEGER DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
          `
        });
        
        if (createTableError) {
          console.error('Error creating profiles table:', createTableError);
        } else {
          console.log('Profiles table created successfully!');
        }
      }
    } else {
      console.log('Profiles table exists.');
      console.log('Sample data:', profiles);
      
      // Check if loyalty_points column exists
      const { data: columns, error: columnsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'loyalty_points';
        `
      });
      
      if (columnsError) {
        console.error('Error checking loyalty_points column:', columnsError);
      } else if (!columns || columns.length === 0) {
        console.log('loyalty_points column does not exist. Adding it...');
        
        // Add loyalty_points column
        const { error: addColumnError } = await supabase.rpc('execute_sql', {
          sql_query: `
            ALTER TABLE public.profiles
            ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
          `
        });
        
        if (addColumnError) {
          console.error('Error adding loyalty_points column:', addColumnError);
        } else {
          console.log('loyalty_points column added successfully!');
        }
      } else {
        console.log('loyalty_points column exists:', columns);
      }
    }
    
    // Check if the trigger exists
    console.log('\nChecking user registration trigger...');
    
    // Try to create the trigger function and trigger
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
checkProfilesTable();
