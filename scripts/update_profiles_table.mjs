import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

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

async function updateProfilesTable() {
  try {
    console.log('Updating profiles table...');
    
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'db', 'update_profiles_table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into separate statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing SQL statement: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('execute_sql', {
        sql_query: statement + ';'
      });
      
      if (error) {
        console.error('Error executing SQL statement:', error);
        
        // Try direct query if RPC fails
        console.log('Trying direct query...');
        const { error: directError } = await supabase.query(statement);
        
        if (directError) {
          console.error('Error with direct query:', directError);
        } else {
          console.log('Direct query successful');
        }
      } else {
        console.log('SQL statement executed successfully');
      }
    }
    
    console.log('Profiles table updated successfully');
    
    // Verify the changes
    const { data: profileColumns, error: columnsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (columnsError) {
      console.error('Error fetching profile columns:', columnsError);
    } else {
      console.log('Profile table structure:');
      if (profileColumns && profileColumns.length > 0) {
        console.log(Object.keys(profileColumns[0]));
      } else {
        console.log('No profiles found to check structure');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
updateProfilesTable();
