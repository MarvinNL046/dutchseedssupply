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

async function checkDatabaseTablesStructure() {
  console.log('Checking database tables structure...');

  try {
    // List all tables in the public schema
    console.log('\n--- Public Tables ---');
    const { data: publicTables, error: publicTablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (publicTablesError) {
      console.error('Error listing public tables:', publicTablesError);
    } else {
      console.log('Public tables:', publicTables.map(t => t.table_name));

      // For each table, get its columns
      for (const table of publicTables) {
        const tableName = table.table_name;
        console.log(`\n--- Columns for table: ${tableName} ---`);
        
        const { data: columns, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_schema', 'public')
          .eq('table_name', tableName)
          .order('ordinal_position');
        
        if (columnsError) {
          console.error(`Error getting columns for table ${tableName}:`, columnsError);
        } else {
          console.log(`Columns for ${tableName}:`, columns);
        }
      }
    }

    // Check if specific tables exist
    const tablesToCheck = [
      'products',
      'product_translations',
      'product_categories',
      'product_variants',
      'categories'
    ];

    console.log('\n--- Checking for specific tables ---');
    for (const tableName of tablesToCheck) {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .eq('table_type', 'BASE TABLE');
      
      if (error) {
        console.error(`Error checking if ${tableName} exists:`, error);
      } else {
        console.log(`Table ${tableName} exists:`, data.length > 0);
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkDatabaseTablesStructure();
