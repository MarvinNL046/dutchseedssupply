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

async function setupDatabase() {
  console.log('Starting database setup...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // 1. Create the profiles table
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
      
      // 2. Enable RLS on the profiles table
      const { error: enableRlsError } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        `
      });
      
      if (enableRlsError) {
        console.error('Error enabling RLS on profiles table:', enableRlsError);
      } else {
        console.log('RLS enabled on profiles table successfully.');
        
        // 3. Create RLS policies for the profiles table
        console.log('\n--- Creating RLS policies ---');
        
        // First, drop any existing policies to avoid conflicts
        const { error: dropPoliciesError } = await supabase.rpc('execute_sql', {
          sql_query: `
            DROP POLICY IF EXISTS admin_all_profiles ON public.profiles;
            DROP POLICY IF EXISTS users_read_own_profile ON public.profiles;
            DROP POLICY IF EXISTS users_update_own_profile ON public.profiles;
            DROP POLICY IF EXISTS service_role_all_profiles ON public.profiles;
          `
        });
        
        if (dropPoliciesError) {
          console.error('Error dropping existing policies:', dropPoliciesError);
        } else {
          console.log('Existing policies dropped successfully.');
          
          // Create new policies
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
            console.error('Error creating RLS policies:', createPoliciesError);
          } else {
            console.log('RLS policies created successfully.');
          }
        }
      }
    }
    
    // 4. Create the handle_new_user function
    console.log('\n--- Creating handle_new_user function ---');
    
    // First, drop the existing function if it exists
    const { error: dropFunctionError } = await supabase.rpc('execute_sql', {
      sql_query: `
        DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
      `
    });
    
    if (dropFunctionError) {
      console.error('Error dropping existing function:', dropFunctionError);
    } else {
      console.log('Existing function dropped successfully.');
      
      // Create the function
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
        
        // 5. Create the trigger
        console.log('\n--- Creating trigger ---');
        
        // First, drop the existing trigger if it exists
        const { error: dropTriggerError } = await supabase.rpc('execute_sql', {
          sql_query: `
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          `
        });
        
        if (dropTriggerError) {
          console.error('Error dropping existing trigger:', dropTriggerError);
        } else {
          console.log('Existing trigger dropped successfully.');
          
          // Create the trigger
          const { error: createTriggerError } = await supabase.rpc('execute_sql', {
            sql_query: `
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
      }
    }
    
    // 6. Create an admin user
    console.log('\n--- Creating admin user ---');
    
    const adminEmail = 'admin@dutchseedsupply.com';
    const adminPassword = 'Admin123!';
    
    // Create the admin user in auth.users
    const { data: adminUser, error: createAdminError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });
    
    if (createAdminError) {
      console.error('Error creating admin user:', createAdminError);
    } else {
      console.log('Admin user created successfully:', adminUser.user.id);
      
      // Update the admin user's role in the profiles table
      const { error: updateAdminError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.user.id);
      
      if (updateAdminError) {
        console.error('Error updating admin role:', updateAdminError);
      } else {
        console.log('Admin role updated successfully.');
      }
    }
    
    console.log('\nDatabase setup completed!');
    console.log('\nAdmin user credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
  } catch (error) {
    console.error('Unexpected error during database setup:', error);
  }
}

// Run the function
setupDatabase();
