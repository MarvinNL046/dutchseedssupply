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

async function checkAllTriggersAndFunctions() {
  console.log('Checking all triggers and functions...');

  try {
    // Check all triggers
    console.log('\n--- All Triggers ---');
    const { data: triggers, error: triggersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          trigger_name, 
          event_object_schema, 
          event_object_table, 
          action_statement
        FROM information_schema.triggers
        ORDER BY event_object_schema, event_object_table, trigger_name;
      `
    });

    if (triggersError) {
      console.error('Error fetching triggers:', triggersError);
    } else {
      console.log('All triggers:');
      console.log(triggers);
    }

    // Check all functions
    console.log('\n--- All Functions ---');
    const { data: functions, error: functionsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          n.nspname AS schema_name,
          p.proname AS function_name,
          pg_get_functiondef(p.oid) AS function_definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY n.nspname, p.proname;
      `
    });

    if (functionsError) {
      console.error('Error fetching functions:', functionsError);
    } else {
      console.log('All functions:');
      console.log(functions);
    }

    // Check if users table exists
    console.log('\n--- Users Table Check ---');
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
      console.log('Users table exists:', usersTable);
    }

    // If users table exists, check its structure
    if (usersTable && usersTable[0]?.users_table_exists) {
      const { data: usersColumns, error: usersColumnsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'users'
          ORDER BY ordinal_position;
        `
      });

      if (usersColumnsError) {
        console.error('Error fetching users table structure:', usersColumnsError);
      } else {
        console.log('Users table columns:');
        console.log(usersColumns);
      }

      // Add loyalty_points column to users table if it exists but doesn't have the column
      console.log('\n--- Adding loyalty_points column to users table ---');
      const { error: addColumnError } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE public.users
          ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;
        `
      });

      if (addColumnError) {
        console.error('Error adding loyalty_points column to users table:', addColumnError);
      } else {
        console.log('loyalty_points column added to users table successfully (if it didn\'t exist)!');
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkAllTriggersAndFunctions();
