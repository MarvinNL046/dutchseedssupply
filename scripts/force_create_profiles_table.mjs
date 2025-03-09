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

async function forceCreateProfilesTable() {
  console.log('Force creating profiles table...');

  try {
    // Drop the profiles table if it exists
    console.log('Dropping profiles table if it exists...');
    
    const { error: dropTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        DROP TABLE IF EXISTS public.profiles CASCADE;
      `
    });
    
    if (dropTableError) {
      console.error('Error dropping profiles table:', dropTableError);
      return;
    }
    
    console.log('Profiles table dropped successfully (if it existed)!');

    // Create the profiles table
    console.log('Creating profiles table...');
    
    const { error: createTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          role TEXT DEFAULT 'user',
          loyalty_points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });
    
    if (createTableError) {
      console.error('Error creating profiles table:', createTableError);
      return;
    }
    
    console.log('Profiles table created successfully!');

    // Enable RLS on the profiles table
    console.log('Enabling RLS on profiles table...');
    
    const { error: enableRlsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (enableRlsError) {
      console.error('Error enabling RLS on profiles table:', enableRlsError);
      return;
    }
    
    console.log('RLS enabled on profiles table successfully!');

    // Create RLS policies for the profiles table
    console.log('Creating RLS policies for profiles table...');
    
    const { error: createPoliciesError } = await supabase.rpc('execute_sql', {
      sql_query: `
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
      `
    });
    
    if (createPoliciesError) {
      console.error('Error creating RLS policies for profiles table:', createPoliciesError);
      return;
    }
    
    console.log('RLS policies created for profiles table successfully!');

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

    console.log('Profiles table setup completed successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
forceCreateProfilesTable();
