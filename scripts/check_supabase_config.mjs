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

async function checkSupabaseConfig() {
  console.log('Checking Supabase configuration...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Role Key (first 5 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) + '...');

  try {
    // Check if the auth.users table exists
    console.log('\nChecking auth.users table...');
    
    const { data: authUsersExists, error: authUsersExistsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'auth' 
          AND table_name = 'users'
        ) AS auth_users_exists;
      `
    });
    
    if (authUsersExistsError) {
      console.error('Error checking if auth.users table exists:', authUsersExistsError);
    } else {
      console.log('auth.users table exists:', authUsersExists);
    }

    // Check if the profiles table exists
    console.log('\nChecking profiles table...');
    
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
    } else {
      console.log('profiles table exists:', profilesExists);
    }

    // Check if the handle_new_user function exists
    console.log('\nChecking handle_new_user function...');
    
    const { data: functionExists, error: functionExistsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM pg_proc
          WHERE proname = 'handle_new_user'
          AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ) AS function_exists;
      `
    });
    
    if (functionExistsError) {
      console.error('Error checking if handle_new_user function exists:', functionExistsError);
    } else {
      console.log('handle_new_user function exists:', functionExists);
    }

    // Check if the on_auth_user_created trigger exists
    console.log('\nChecking on_auth_user_created trigger...');
    
    const { data: triggerExists, error: triggerExistsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT EXISTS (
          SELECT FROM pg_trigger
          WHERE tgname = 'on_auth_user_created'
        ) AS trigger_exists;
      `
    });
    
    if (triggerExistsError) {
      console.error('Error checking if on_auth_user_created trigger exists:', triggerExistsError);
    } else {
      console.log('on_auth_user_created trigger exists:', triggerExists);
    }

    // Check the structure of the profiles table
    console.log('\nChecking profiles table structure...');
    
    const { data: profilesColumns, error: profilesColumnsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          column_name, 
          data_type, 
          is_nullable
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public' 
          AND table_name = 'profiles'
        ORDER BY 
          ordinal_position;
      `
    });
    
    if (profilesColumnsError) {
      console.error('Error checking profiles table structure:', profilesColumnsError);
    } else {
      console.log('profiles table structure:', profilesColumns);
    }

    // Check the structure of the auth.users table
    console.log('\nChecking auth.users table structure...');
    
    const { data: authUsersColumns, error: authUsersColumnsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          column_name, 
          data_type, 
          is_nullable
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'auth' 
          AND table_name = 'users'
        ORDER BY 
          ordinal_position;
      `
    });
    
    if (authUsersColumnsError) {
      console.error('Error checking auth.users table structure:', authUsersColumnsError);
    } else {
      console.log('auth.users table structure:', authUsersColumns);
    }

    // Check the definition of the handle_new_user function
    console.log('\nChecking handle_new_user function definition...');
    
    const { data: functionDef, error: functionDefError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          prosrc
        FROM 
          pg_proc
        WHERE 
          proname = 'handle_new_user'
          AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
      `
    });
    
    if (functionDefError) {
      console.error('Error checking handle_new_user function definition:', functionDefError);
    } else {
      console.log('handle_new_user function definition:', functionDef);
    }

    // Check the definition of the on_auth_user_created trigger
    console.log('\nChecking on_auth_user_created trigger definition...');
    
    const { data: triggerDef, error: triggerDefError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          pg_get_triggerdef(oid) AS trigger_def
        FROM 
          pg_trigger
        WHERE 
          tgname = 'on_auth_user_created';
      `
    });
    
    if (triggerDefError) {
      console.error('Error checking on_auth_user_created trigger definition:', triggerDefError);
    } else {
      console.log('on_auth_user_created trigger definition:', triggerDef);
    }

    // Check if there are any RLS policies on the profiles table
    console.log('\nChecking RLS policies on profiles table...');
    
    const { data: rlsPolicies, error: rlsPoliciesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          polname, 
          polcmd, 
          polpermissive, 
          polroles, 
          polqual, 
          polwithcheck
        FROM 
          pg_policy
        WHERE 
          polrelid = 'public.profiles'::regclass;
      `
    });
    
    if (rlsPoliciesError) {
      console.error('Error checking RLS policies on profiles table:', rlsPoliciesError);
    } else {
      console.log('RLS policies on profiles table:', rlsPolicies);
    }

    // Check if RLS is enabled on the profiles table
    console.log('\nChecking if RLS is enabled on profiles table...');
    
    const { data: rlsEnabled, error: rlsEnabledError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          relrowsecurity
        FROM 
          pg_class
        WHERE 
          oid = 'public.profiles'::regclass;
      `
    });
    
    if (rlsEnabledError) {
      console.error('Error checking if RLS is enabled on profiles table:', rlsEnabledError);
    } else {
      console.log('RLS enabled on profiles table:', rlsEnabled);
    }

    console.log('\nSupabase configuration check completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkSupabaseConfig();
