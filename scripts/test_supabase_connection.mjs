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

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Role Key (first 5 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) + '...');

  try {
    // Test basic connection by getting the current user
    console.log('\n--- Testing auth connection ---');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error connecting to Supabase Auth:', authError);
    } else {
      console.log('Successfully connected to Supabase Auth');
      console.log('Auth data:', authData);
    }

    // Test database connection by querying a simple system table
    console.log('\n--- Testing database connection ---');
    const { data: dbData, error: dbError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);
    
    if (dbError) {
      console.error('Error connecting to Supabase Database:', dbError);
      
      // Try another table that might exist
      console.log('\nTrying to query pg_tables...');
      const { data: pgData, error: pgError } = await supabase.rpc('execute_sql', {
        sql_query: 'SELECT * FROM pg_tables LIMIT 1;'
      });
      
      if (pgError) {
        console.error('Error querying pg_tables:', pgError);
      } else {
        console.log('Successfully queried pg_tables');
        console.log('pg_tables data:', pgData);
      }
    } else {
      console.log('Successfully connected to Supabase Database');
      console.log('Database data:', dbData);
    }

    // Test storage connection
    console.log('\n--- Testing storage connection ---');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error connecting to Supabase Storage:', bucketsError);
    } else {
      console.log('Successfully connected to Supabase Storage');
      console.log('Storage buckets:', buckets);
    }

    // Test direct SQL execution
    console.log('\n--- Testing SQL execution ---');
    const { data: sqlData, error: sqlError } = await supabase.rpc('execute_sql', {
      sql_query: 'SELECT current_database(), current_user, version();'
    });
    
    if (sqlError) {
      console.error('Error executing SQL:', sqlError);
    } else {
      console.log('Successfully executed SQL');
      console.log('SQL data:', sqlData);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
testSupabaseConnection();
