// This script sets up the admin user in the database
// Run with: node --experimental-modules scripts/setup_admin.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

// Read the SQL file
const sqlFilePath = path.join(__dirname, '..', 'db', 'insert_admin_user.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split the SQL content into individual statements
const statements = sqlContent
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

async function executeStatements() {
  try {
    console.log('Setting up admin user...');
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement}`);
      
      // Skip comments
      if (statement.startsWith('--')) {
        continue;
      }
      
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error('Error executing SQL:', error);
      } else {
        console.log('Result:', data);
      }
    }
    
    console.log('Admin user setup complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

executeStatements();
