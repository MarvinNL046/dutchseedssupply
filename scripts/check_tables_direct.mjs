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

async function checkTable(tableName) {
  console.log(`\n--- Checking table: ${tableName} ---`);
  
  try {
    // Try to select from the table with a limit of 1 to see if it exists
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.log(`Table ${tableName} does not exist.`);
        return false;
      } else {
        console.error(`Error checking table ${tableName}:`, error);
        return false;
      }
    }
    
    console.log(`Table ${tableName} exists.`);
    console.log(`Sample data:`, data);
    
    // If we have data, show the structure based on the first row
    if (data && data.length > 0) {
      console.log(`Table structure (based on first row):`);
      const columns = Object.keys(data[0]);
      const structure = columns.map(column => {
        const value = data[0][column];
        const type = value === null ? 'unknown' : typeof value;
        return { column, type };
      });
      console.log(structure);
    }
    
    return true;
  } catch (error) {
    console.error(`Unexpected error checking table ${tableName}:`, error);
    return false;
  }
}

async function checkTables() {
  console.log('Checking tables directly...');
  
  const tablesToCheck = [
    'products',
    'product_translations',
    'product_categories',
    'product_variants',
    'categories'
  ];
  
  for (const tableName of tablesToCheck) {
    await checkTable(tableName);
  }
}

// Run the function
checkTables().catch(err => {
  console.error('Error in checkTables:', err);
});
