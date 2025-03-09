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

async function checkUsersTableReferences() {
  console.log('Checking for references to the users table...');

  try {
    // Check for functions that might reference the users table
    console.log('\n--- Checking functions for users table references ---');
    const { data: functions, error: functionsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT proname, prosrc
        FROM pg_proc
        WHERE prosrc LIKE '%users%'
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
      `
    });

    if (functionsError) {
      console.error('Error checking functions:', functionsError);
    } else {
      console.log('Functions referencing users table:');
      console.log(functions);
    }

    // Check for triggers that might reference the users table
    console.log('\n--- Checking triggers for users table references ---');
    const { data: triggers, error: triggersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT tgname, tgrelid::regclass AS table_name, pg_get_triggerdef(oid) AS trigger_def
        FROM pg_trigger
        WHERE pg_get_triggerdef(oid) LIKE '%users%'
        AND tgrelid::regclass::text NOT LIKE 'pg_%'
        AND tgrelid::regclass::text NOT LIKE 'auth.%';
      `
    });

    if (triggersError) {
      console.error('Error checking triggers:', triggersError);
    } else {
      console.log('Triggers referencing users table:');
      console.log(triggers);
    }

    // Check for views that might reference the users table
    console.log('\n--- Checking views for users table references ---');
    const { data: views, error: viewsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT viewname, definition
        FROM pg_views
        WHERE schemaname = 'public'
        AND definition LIKE '%users%';
      `
    });

    if (viewsError) {
      console.error('Error checking views:', viewsError);
    } else {
      console.log('Views referencing users table:');
      console.log(views);
    }

    // Check for foreign keys that might reference the users table
    console.log('\n--- Checking foreign keys for users table references ---');
    const { data: foreignKeys, error: foreignKeysError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT
          tc.table_schema, 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND (ccu.table_name = 'users' OR tc.table_name = 'users');
      `
    });

    if (foreignKeysError) {
      console.error('Error checking foreign keys:', foreignKeysError);
    } else {
      console.log('Foreign keys referencing users table:');
      console.log(foreignKeys);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkUsersTableReferences();
