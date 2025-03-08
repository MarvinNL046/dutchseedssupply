// This script sets up the user registration trigger in Supabase
// Run with: node scripts/setup_user_registration.mjs

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

async function setupUserRegistration() {
  try {
    console.log('Setting up user registration trigger...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'db', 'user_registration_trigger.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', { sql_query: sqlContent });
    
    if (error) {
      console.error('Error setting up user registration trigger:', error);
      process.exit(1);
    }
    
    console.log('User registration trigger set up successfully!');
    
    // Verify the trigger was created
    const { data: triggers, error: triggersError } = await supabase.rpc('execute_sql', { 
      sql_query: "SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';" 
    });
    
    if (triggersError) {
      console.error('Error verifying trigger:', triggersError);
    } else {
      console.log('Trigger verification:', triggers);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

setupUserRegistration();
