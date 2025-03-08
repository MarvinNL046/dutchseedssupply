// This script creates an admin user in Supabase Authentication
// Run with: node scripts/create_admin_user.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('Looking up admin user...');
    
    // Try to get the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error listing users:', userError);
      process.exit(1);
    }
    
    // Find the user with the email marvinsmit1988@gmail.com
    const adminUser = userData.users.find(user => user.email === 'marvinsmit1988@gmail.com');
    
    if (!adminUser) {
      console.error('Admin user not found. Please create a user with email marvinsmit1988@gmail.com in Supabase Authentication.');
      process.exit(1);
    }
    
    console.log('Admin user found:', adminUser);
    
    // Create SQL file with the user ID
    const sqlContent = `
-- Insert admin user into the public.users table
INSERT INTO public.users (id, email, role, loyalty_points)
VALUES ('${adminUser.id}', 'marvinsmit1988@gmail.com', 'admin', 0);
    `.trim();
    
    fs.writeFileSync(path.join(__dirname, '..', 'db', 'insert_admin_user.sql'), sqlContent);
    console.log('SQL file created: db/insert_admin_user.sql');
    
    console.log('Now run the following commands to create the users table and insert the admin user:');
    console.log('1. Run the SQL in db/create_users_table.sql in your Supabase SQL Editor');
    console.log('2. Run the SQL in db/insert_admin_user.sql in your Supabase SQL Editor');
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();
