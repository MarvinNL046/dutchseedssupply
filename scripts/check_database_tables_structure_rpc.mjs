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

async function executeQuery(query, description) {
  console.log(`\n--- ${description} ---`);
  try {
    const { data, error } = await supabase.rpc('pgmoon.query', { query });
    
    if (error) {
      console.error(`Error executing query for ${description}:`, error);
      return null;
    }
    
    console.log(`Results for ${description}:`, data);
    return data;
  } catch (error) {
    console.error(`Unexpected error executing query for ${description}:`, error);
    return null;
  }
}

async function checkDatabaseTablesStructure() {
  console.log('Checking database tables structure...');

  // List all tables in the public schema
  await executeQuery(
    `SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_type = 'BASE TABLE'
     ORDER BY table_name`,
    'Public Tables'
  );

  // Check if specific tables exist
  const tablesToCheck = [
    'products',
    'product_translations',
    'product_categories',
    'product_variants',
    'categories'
  ];

  for (const tableName of tablesToCheck) {
    await executeQuery(
      `SELECT EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' 
         AND table_name = '${tableName}'
       ) AS table_exists`,
      `Check if ${tableName} exists`
    );
  }

  // For each table that exists, get its columns
  for (const tableName of tablesToCheck) {
    await executeQuery(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public'
       AND table_name = '${tableName}'
       ORDER BY ordinal_position`,
      `Columns for ${tableName}`
    );
  }

  // Check for foreign keys in product-related tables
  await executeQuery(
    `SELECT
       tc.table_name, 
       kcu.column_name, 
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
     AND tc.table_schema = 'public'
     AND tc.table_name IN ('products', 'product_translations', 'product_categories', 'product_variants')
     ORDER BY tc.table_name, kcu.column_name`,
    'Foreign Keys in Product Tables'
  );
}

// Run the function
checkDatabaseTablesStructure().catch(err => {
  console.error('Error in checkDatabaseTablesStructure:', err);
});
