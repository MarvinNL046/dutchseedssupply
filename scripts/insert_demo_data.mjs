#!/usr/bin/env node

/**
 * Script to insert demo product data into Supabase database
 * 
 * This script executes the SQL in db/insert_demo_products.sql to add
 * realistic cannabis seed products with translations and variants
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SQL file
const sqlFilePath = path.join(__dirname, '..', 'db', 'insert_demo_products.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertDemoData() {
  console.log('Inserting demo product data into Supabase...');
  
  try {
    // Execute the SQL script
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }
    
    console.log('✅ Demo product data successfully inserted!');
    console.log('Added 10 cannabis seed products with:');
    console.log('- Translations in 4 languages (en, nl, de, fr)');
    console.log('- Price variants for 4 domains (nl, com, de, fr)');
    console.log('- Category associations');
    console.log('- Realistic cannabis strain properties');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

insertDemoData();
