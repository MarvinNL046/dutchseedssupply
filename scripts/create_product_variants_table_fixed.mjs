import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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

async function createProductVariantsTable() {
  console.log('Creating product_variants table...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'db', 'create_product_variants_table.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      // Try an alternative approach if the RPC method fails
      console.log('Trying alternative approach with multiple statements...');
      
      // Split the SQL into separate statements
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      // Execute each statement separately
      for (const stmt of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt });
        if (error) {
          console.error(`Error executing statement: ${stmt}`);
          console.error(error);
        } else {
          console.log(`Successfully executed statement: ${stmt.substring(0, 50)}...`);
        }
      }
    } else {
      console.log('Successfully created product_variants table and inserted sample data!');
    }
  } catch (err) {
    console.error('Error in createProductVariantsTable:', err);
  }
}

// Run the function
createProductVariantsTable();
