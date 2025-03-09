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

async function listAllTables() {
  console.log('Listing all tables in the database...');

  try {
    // List all tables in all schemas
    const { data: allTables, error: allTablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          table_schema,
          table_name,
          table_type
        FROM 
          information_schema.tables
        WHERE 
          table_schema NOT IN ('pg_catalog', 'information_schema')
          AND table_type = 'BASE TABLE'
        ORDER BY 
          table_schema, table_name;
      `
    });

    if (allTablesError) {
      console.error('Error listing all tables:', allTablesError);
    } else {
      console.log('All tables in the database:');
      console.log(allTables);
    }

    // List all tables in the public schema
    const { data: publicTables, error: publicTablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          table_name
        FROM 
          information_schema.tables
        WHERE 
          table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY 
          table_name;
      `
    });

    if (publicTablesError) {
      console.error('Error listing public tables:', publicTablesError);
    } else {
      console.log('\nTables in the public schema:');
      console.log(publicTables);
    }

    // List all tables in the auth schema
    const { data: authTables, error: authTablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT 
          table_name
        FROM 
          information_schema.tables
        WHERE 
          table_schema = 'auth'
          AND table_type = 'BASE TABLE'
        ORDER BY 
          table_name;
      `
    });

    if (authTablesError) {
      console.error('Error listing auth tables:', authTablesError);
    } else {
      console.log('\nTables in the auth schema:');
      console.log(authTables);
    }

    // Try to directly query the auth.users table
    const { data: authUsers, error: authUsersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT COUNT(*) FROM auth.users;
      `
    });

    if (authUsersError) {
      console.error('Error querying auth.users:', authUsersError);
    } else {
      console.log('\nNumber of users in auth.users:');
      console.log(authUsers);
    }

    // Try to directly query the profiles table if it exists
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
      console.log('\nProfiles table exists:');
      console.log(profilesExists);

      if (profilesExists && profilesExists[0]?.profiles_table_exists) {
        // Query the profiles table
        const { data: profiles, error: profilesError } = await supabase.rpc('execute_sql', {
          sql_query: `
            SELECT * FROM public.profiles LIMIT 5;
          `
        });

        if (profilesError) {
          console.error('Error querying profiles table:', profilesError);
        } else {
          console.log('\nSample data from profiles table:');
          console.log(profiles);
        }

        // Check the structure of the profiles table
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
          console.error('Error getting profiles table structure:', profilesColumnsError);
        } else {
          console.log('\nProfiles table structure:');
          console.log(profilesColumns);
        }
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
listAllTables();
