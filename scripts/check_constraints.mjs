import fetch from 'node-fetch';
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkConstraints() {
  console.log('Checking database constraints...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Role Key (first 5 chars):', supabaseKey.substring(0, 5) + '...');

  try {
    // Check constraints on profiles table
    console.log('\n--- Checking constraints on profiles table ---');
    
    const constraintsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          SELECT
            tc.constraint_name,
            tc.constraint_type,
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM
            information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            LEFT JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
          WHERE
            tc.table_name = 'profiles'
            AND tc.table_schema = 'public'
          ORDER BY
            tc.constraint_name,
            kcu.column_name;
        `
      })
    });
    
    const constraintsData = await constraintsResponse.json();
    
    console.log('Constraints on profiles table:', constraintsData);

    // Check triggers on auth.users table
    console.log('\n--- Checking triggers on auth.users table ---');
    
    const triggersResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          SELECT
            trigger_name,
            event_manipulation,
            action_statement,
            action_timing
          FROM
            information_schema.triggers
          WHERE
            event_object_table = 'users'
            AND event_object_schema = 'auth'
          ORDER BY
            trigger_name;
        `
      })
    });
    
    const triggersData = await triggersResponse.json();
    
    console.log('Triggers on auth.users table:', triggersData);

    // Check if the handle_new_user function exists
    console.log('\n--- Checking handle_new_user function ---');
    
    const functionResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          SELECT
            p.proname AS function_name,
            pg_get_functiondef(p.oid) AS function_definition
          FROM
            pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
          WHERE
            n.nspname = 'public'
            AND p.proname = 'handle_new_user';
        `
      })
    });
    
    const functionData = await functionResponse.json();
    
    console.log('handle_new_user function:', functionData);

    // Check if the loyalty_points column exists in the profiles table
    console.log('\n--- Checking loyalty_points column in profiles table ---');
    
    const columnResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          SELECT
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM
            information_schema.columns
          WHERE
            table_schema = 'public'
            AND table_name = 'profiles'
            AND column_name = 'loyalty_points';
        `
      })
    });
    
    const columnData = await columnResponse.json();
    
    console.log('loyalty_points column in profiles table:', columnData);

    // Check all columns in the profiles table
    console.log('\n--- Checking all columns in profiles table ---');
    
    const allColumnsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          SELECT
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM
            information_schema.columns
          WHERE
            table_schema = 'public'
            AND table_name = 'profiles'
          ORDER BY
            ordinal_position;
        `
      })
    });
    
    const allColumnsData = await allColumnsResponse.json();
    
    console.log('All columns in profiles table:', allColumnsData);

    console.log('\nConstraints check completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkConstraints();
