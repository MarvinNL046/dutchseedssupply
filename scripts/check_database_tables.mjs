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

async function checkDatabaseTables() {
  console.log('Checking database tables...');

  try {
    // List all tables in the public schema
    const { data: tables, error: tablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `
    });

    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Tables in public schema:');
      console.log(tables);
    }

    // Check if profiles table exists and its structure
    const { data: profilesColumns, error: profilesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'profiles'
        ORDER BY ordinal_position;
      `
    });

    if (profilesError) {
      console.error('Error checking profiles table structure:', profilesError);
    } else {
      console.log('\nProfiles table structure:');
      console.log(profilesColumns);
    }

    // Check if there are any triggers on auth.users
    const { data: triggers, error: triggersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT tgname, tgrelid::regclass AS table_name, pg_get_triggerdef(oid) AS trigger_def
        FROM pg_trigger
        WHERE tgrelid::regclass::text = 'auth.users'
        ORDER BY tgname;
      `
    });

    if (triggersError) {
      console.error('Error checking triggers on auth.users:', triggersError);
    } else {
      console.log('\nTriggers on auth.users:');
      console.log(triggers);
    }

    // Check the handle_new_user function
    const { data: functionDef, error: functionError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT prosrc
        FROM pg_proc
        WHERE proname = 'handle_new_user'
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
      `
    });

    if (functionError) {
      console.error('Error checking handle_new_user function:', functionError);
    } else {
      console.log('\nhandle_new_user function definition:');
      console.log(functionDef);
    }

    // Check RLS policies on profiles table
    const { data: policies, error: policiesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT * FROM pg_policies WHERE tablename = 'profiles';
      `
    });

    if (policiesError) {
      console.error('Error checking RLS policies on profiles table:', policiesError);
    } else {
      console.log('\nRLS policies on profiles table:');
      console.log(policies);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkDatabaseTables();
