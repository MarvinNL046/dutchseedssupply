// This script adds the loyalty_points column to the users table in the production database
// Run with: node scripts/add_loyalty_points_column.mjs

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

async function addLoyaltyPointsColumn() {
  try {
    console.log('Adding loyalty_points column to users table...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'db', 'add_loyalty_points_column.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sqlContent });
    
    if (error) {
      console.error('Error adding loyalty_points column:', error);
      process.exit(1);
    }
    
    console.log('Result:', data);
    console.log('loyalty_points column added successfully (or already exists)!');
    
    // Check if the column exists
    const { data: columns, error: columnsError } = await supabase.rpc('execute_sql', { 
      sql_query: `
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'loyalty_points';
      `
    });
    
    if (columnsError) {
      console.error('Error checking column:', columnsError);
    } else {
      console.log('Column verification:', columns);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

addLoyaltyPointsColumn();
