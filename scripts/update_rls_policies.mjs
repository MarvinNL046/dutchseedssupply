// This script updates the RLS policies for the users table
// Run with: node scripts/update_rls_policies.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateRlsPolicies() {
  try {
    console.log('Updating RLS policies for users table...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'db', 'update_rls_policies.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', { sql_query: sqlContent });
    
    if (error) {
      console.error('Error updating RLS policies:', error);
      process.exit(1);
    }
    
    console.log('RLS policies updated successfully!');
    
    // Verify the policies were created
    const { data: policies, error: policiesError } = await supabase.rpc('execute_sql', { 
      sql_query: "SELECT * FROM pg_policies WHERE tablename = 'users';" 
    });
    
    if (policiesError) {
      console.error('Error verifying policies:', policiesError);
    } else {
      console.log('Policies verification:', policies);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

updateRlsPolicies();
