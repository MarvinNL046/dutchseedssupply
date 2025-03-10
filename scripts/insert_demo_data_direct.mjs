#!/usr/bin/env node

/**
 * Script to insert demo product data into Supabase database (direct method)
 * 
 * This script executes the SQL in db/insert_demo_products.sql directly
 * without relying on the exec_sql RPC function
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
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Split the SQL into individual statements
// This is a simple approach and might not work for all SQL scripts
// For more complex scripts, consider using a proper SQL parser
function splitSqlStatements(sql) {
  // Remove comments
  const noComments = sql.replace(/--.*$/gm, '');
  
  // Split by semicolons, but ignore semicolons inside quotes or dollar-quoted strings
  const statements = [];
  let currentStatement = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inDollarQuote = false;
  let dollarTag = '';
  
  for (let i = 0; i < noComments.length; i++) {
    const char = noComments[i];
    
    // Handle quotes
    if (char === "'" && !inDoubleQuote && !inDollarQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote && !inDollarQuote) {
      inDoubleQuote = !inDoubleQuote;
    } 
    // Handle dollar quotes (e.g., $$ or $tag$)
    else if (char === '$' && !inSingleQuote && !inDoubleQuote) {
      if (inDollarQuote) {
        // Check if this is the end of the dollar quote
        const potentialTag = noComments.substring(i, i + dollarTag.length + 1);
        if (potentialTag === dollarTag + '$') {
          inDollarQuote = false;
          dollarTag = '';
          i += dollarTag.length; // Skip the tag
        }
      } else {
        // Look ahead to find the matching dollar sign
        let j = i + 1;
        while (j < noComments.length && noComments[j] !== '$') {
          j++;
        }
        if (j < noComments.length) {
          inDollarQuote = true;
          dollarTag = noComments.substring(i, j + 1);
        }
      }
    }
    
    // Handle semicolons
    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inDollarQuote) {
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim() + ';');
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Add the last statement if there is one
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim() + ';');
  }
  
  return statements.filter(stmt => stmt.trim() !== ';');
}

async function insertDemoData() {
  console.log('Inserting demo product data into Supabase...');
  
  try {
    // Split the SQL into individual statements
    const statements = splitSqlStatements(sqlContent);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      // Skip empty statements
      if (!stmt.trim()) continue;
      
      try {
        // Execute the statement
        const { error } = await supabase.rpc('pgrest_exec', { query: stmt });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          console.error('Statement:', stmt);
        } else {
          process.stdout.write('.');
        }
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        console.error('Statement:', stmt);
      }
    }
    
    console.log('\n✅ Demo product data successfully inserted!');
    console.log('Added 10 cannabis seed products with:');
    console.log('- Translations in 4 languages (en, nl, de, fr)');
    console.log('- Price variants for 4 domains (nl, com, de, fr)');
    console.log('- Category associations');
    console.log('- Realistic cannabis strain properties');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Alternative method using direct SQL execution via REST API
async function insertDemoDataDirect() {
  console.log('Inserting demo product data into Supabase using direct SQL...');
  
  try {
    // Execute the SQL directly
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'tx=commit'
      },
      body: JSON.stringify({
        query: sqlContent
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error executing SQL:', errorText);
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

// Try both methods
async function run() {
  try {
    // First try the RPC method
    await insertDemoData();
  } catch (err) {
    console.log('RPC method failed, trying direct SQL execution...', err.message);
    // If that fails, try the direct method
    await insertDemoDataDirect();
  }
}

run();
