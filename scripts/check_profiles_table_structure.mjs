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

async function checkProfilesTableStructure() {
  console.log('Checking profiles table structure...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Role Key (first 5 chars):', supabaseKey.substring(0, 5) + '...');

  try {
    // Get the structure of the profiles table
    console.log('\n--- Getting profiles table structure ---');
    
    const profilesStructureResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
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
    
    const profilesStructureData = await profilesStructureResponse.json();
    
    console.log('Profiles table structure:', profilesStructureData);

    // Check if the loyalty_points column exists in the profiles table
    console.log('\n--- Checking if loyalty_points column exists ---');
    
    const loyaltyPointsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql_query: `
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'loyalty_points'
          ) AS loyalty_points_exists;
        `
      })
    });
    
    const loyaltyPointsData = await loyaltyPointsResponse.json();
    
    console.log('Loyalty points column exists:', loyaltyPointsData);

    // Check if there are any constraints on the profiles table
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
            kcu.column_name, 
            ccu.table_name AS foreign_table_name, 
            ccu.column_name AS foreign_column_name
          FROM 
            information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            LEFT JOIN information_schema.constraint_column_usage ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
          WHERE 
            tc.table_name = 'profiles'
            AND tc.table_schema = 'public';
        `
      })
    });
    
    const constraintsData = await constraintsResponse.json();
    
    console.log('Constraints on profiles table:', constraintsData);

    // Check if there are any triggers on the profiles table
    console.log('\n--- Checking triggers on profiles table ---');
    
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
            event_object_table = 'profiles'
            AND event_object_schema = 'public';
        `
      })
    });
    
    const triggersData = await triggersResponse.json();
    
    console.log('Triggers on profiles table:', triggersData);

    // Check if there are any triggers on the auth.users table
    console.log('\n--- Checking triggers on auth.users table ---');
    
    const authTriggersResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
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
            AND event_object_schema = 'auth';
        `
      })
    });
    
    const authTriggersData = await authTriggersResponse.json();
    
    console.log('Triggers on auth.users table:', authTriggersData);

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
            proname, 
            prosrc
          FROM 
            pg_proc
          WHERE 
            proname = 'handle_new_user'
            AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
        `
      })
    });
    
    const functionData = await functionResponse.json();
    
    console.log('handle_new_user function:', functionData);

    console.log('\nProfiles table structure check completed!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkProfilesTableStructure();
