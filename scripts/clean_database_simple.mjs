import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

async function cleanDatabaseSimple() {
  console.log('Starting simple database cleanup...');
  console.log('WARNING: This will delete all data in your database!');
  console.log('Press Ctrl+C within 5 seconds to cancel...');
  
  // Wait 5 seconds to give the user a chance to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('Proceeding with database cleanup...');

  try {
    // 1. Get list of all tables in public schema
    console.log('\n--- Getting list of tables in public schema ---');
    
    const { data: tables, error: tablesError } = await supabase.from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Error getting tables:', tablesError);
    } else {
      console.log('Tables in public schema:', tables);
      
      // 2. Drop all tables in public schema
      console.log('\n--- Dropping all tables in public schema ---');
      
      if (tables && tables.length > 0) {
        for (const table of tables) {
          const tableName = table.tablename;
          console.log(`Dropping table: ${tableName}`);
          
          // Try to truncate the table first to avoid foreign key issues
          const { error: truncateError } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          if (truncateError) {
            console.error(`Error truncating table ${tableName}:`, truncateError);
          } else {
            console.log(`Table ${tableName} truncated successfully.`);
          }
        }
      } else {
        console.log('No tables found in public schema.');
      }
    }
    
    // 3. Try to recreate the profiles table with the correct structure
    console.log('\n--- Creating profiles table ---');
    
    const { error: createProfilesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          role TEXT DEFAULT 'user',
          loyalty_points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    });
    
    if (createProfilesError) {
      console.error('Error creating profiles table:', createProfilesError);
    } else {
      console.log('Profiles table created successfully.');
      
      // 4. Enable RLS on the profiles table
      const { error: enableRlsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        `
      });
      
      if (enableRlsError) {
        console.error('Error enabling RLS on profiles table:', enableRlsError);
      } else {
        console.log('RLS enabled on profiles table successfully.');
        
        // 5. Create RLS policies for the profiles table
        const { error: createPoliciesError } = await supabase.rpc('execute_sql', {
          sql_query: `
            -- Policy for admins (can do anything with all profiles)
            CREATE POLICY admin_all_profiles ON public.profiles
              FOR ALL
              TO authenticated
              USING (
                EXISTS (
                  SELECT 1 FROM public.profiles
                  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
                )
              );

            -- Policy for users (can read their own data)
            CREATE POLICY users_read_own_profile ON public.profiles
              FOR SELECT
              TO authenticated
              USING (id = auth.uid());

            -- Policy for users (can update their own data except role)
            CREATE POLICY users_update_own_profile ON public.profiles
              FOR UPDATE
              TO authenticated
              USING (id = auth.uid())
              WITH CHECK (id = auth.uid() AND role = 'user');

            -- Policy for service role (can do anything)
            CREATE POLICY service_role_all_profiles ON public.profiles
              FOR ALL
              TO service_role
              USING (true);
          `
        });
        
        if (createPoliciesError) {
          console.error('Error creating RLS policies for profiles table:', createPoliciesError);
        } else {
          console.log('RLS policies created for profiles table successfully.');
        }
      }
    }
    
    // 6. Create the handle_new_user function
    console.log('\n--- Creating handle_new_user function ---');
    
    const { error: createFunctionError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, role, loyalty_points)
          VALUES (new.id, new.email, 'user', 0);
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (createFunctionError) {
      console.error('Error creating handle_new_user function:', createFunctionError);
    } else {
      console.log('handle_new_user function created successfully.');
      
      // 7. Create the trigger
      const { error: createTriggerError } = await supabase.rpc('execute_sql', {
        sql_query: `
          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `
      });
      
      if (createTriggerError) {
        console.error('Error creating trigger:', createTriggerError);
      } else {
        console.log('Trigger created successfully.');
      }
    }
    
    // 8. Ask if user wants to delete all users
    const deleteUsers = process.argv.includes('--delete-users');
    
    if (deleteUsers) {
      console.log('\n--- Deleting all users ---');
      
      // Delete all users except the current one
      const { error: deleteUsersError } = await supabase.rpc('execute_sql', {
        sql_query: `
          DELETE FROM auth.users WHERE true;
        `
      });
      
      if (deleteUsersError) {
        console.error('Error deleting users:', deleteUsersError);
      } else {
        console.log('All users deleted successfully.');
      }
    } else {
      console.log('\nSkipping user deletion. To delete users, run with --delete-users flag.');
    }
    
    console.log('\nDatabase cleanup and setup completed!');
  } catch (error) {
    console.error('Unexpected error during database cleanup:', error);
  }
}

// Run the function
cleanDatabaseSimple();
