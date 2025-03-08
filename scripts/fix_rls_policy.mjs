// This script fixes the infinite recursion issue in the admin_all_users policy
// Run with: node scripts/fix_rls_policy.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

async function fixRlsPolicy() {
  try {
    console.log('Fixing RLS policy for users table...');
    
    // SQL to fix the RLS policy
    const sql = `
      -- Drop the existing policy
      DROP POLICY IF EXISTS admin_all_users ON public.users;
      DROP POLICY IF EXISTS service_role_all_users ON public.users;
      
      -- Create a new policy without recursion
      CREATE POLICY admin_all_users ON public.users
        FOR ALL
        TO authenticated
        USING (
          -- Only check the current row, not query the table again
          (auth.uid() = id AND role = 'admin') OR
          -- Or a specific admin email (as fallback)
          (SELECT email FROM auth.users WHERE id = auth.uid()) = 'marvinsmit1988@gmail.com'
        );
        
      -- Policy for service role (can do anything)
      CREATE POLICY service_role_all_users ON public.users
        FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
    `;
    
    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error fixing RLS policy:', error);
      process.exit(1);
    }
    
    console.log('RLS policy fixed successfully!');
    
    // Verify the policy was created
    const { data: policies, error: policiesError } = await supabase.rpc('execute_sql', { 
      sql_query: "SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname = 'admin_all_users';" 
    });
    
    if (policiesError) {
      console.error('Error verifying policy:', policiesError);
    } else {
      console.log('Policy verification:', policies);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fixRlsPolicy();
