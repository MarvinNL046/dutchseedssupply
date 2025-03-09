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

async function cleanDatabase() {
  console.log('Starting database cleanup...');
  console.log('WARNING: This will delete all data in your database!');
  console.log('Press Ctrl+C within 5 seconds to cancel...');
  
  // Wait 5 seconds to give the user a chance to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('Proceeding with database cleanup...');

  try {
    // 1. Get list of all tables in public schema
    console.log('\n--- Getting list of tables in public schema ---');
    
    const { data: tables, error: tablesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
      `
    });
    
    if (tablesError) {
      console.error('Error getting tables:', tablesError);
    } else {
      console.log('Tables in public schema:', tables);
      
      // 2. Drop all tables in public schema
      console.log('\n--- Dropping all tables in public schema ---');
      
      // First, disable all foreign key constraints
      const { error: disableFKError } = await supabase.rpc('execute_sql', {
        sql_query: `
          SET session_replication_role = 'replica';
        `
      });
      
      if (disableFKError) {
        console.error('Error disabling foreign key constraints:', disableFKError);
      } else {
        console.log('Foreign key constraints disabled.');
        
        // Drop each table
        if (tables && tables.length > 0) {
          for (const table of tables) {
            const tableName = table.table_name;
            console.log(`Dropping table: ${tableName}`);
            
            const { error: dropTableError } = await supabase.rpc('execute_sql', {
              sql_query: `
                DROP TABLE IF EXISTS public."${tableName}" CASCADE;
              `
            });
            
            if (dropTableError) {
              console.error(`Error dropping table ${tableName}:`, dropTableError);
            } else {
              console.log(`Table ${tableName} dropped successfully.`);
            }
          }
        } else {
          console.log('No tables found in public schema.');
        }
        
        // Re-enable foreign key constraints
        const { error: enableFKError } = await supabase.rpc('execute_sql', {
          sql_query: `
            SET session_replication_role = 'origin';
          `
        });
        
        if (enableFKError) {
          console.error('Error re-enabling foreign key constraints:', enableFKError);
        } else {
          console.log('Foreign key constraints re-enabled.');
        }
      }
    }
    
    // 3. Get list of all functions in public schema
    console.log('\n--- Getting list of functions in public schema ---');
    
    const { data: functions, error: functionsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT routine_name
        FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_type = 'FUNCTION';
      `
    });
    
    if (functionsError) {
      console.error('Error getting functions:', functionsError);
    } else {
      console.log('Functions in public schema:', functions);
      
      // 4. Drop all functions in public schema
      console.log('\n--- Dropping all functions in public schema ---');
      
      if (functions && functions.length > 0) {
        for (const func of functions) {
          const functionName = func.routine_name;
          console.log(`Dropping function: ${functionName}`);
          
          const { error: dropFunctionError } = await supabase.rpc('execute_sql', {
            sql_query: `
              DROP FUNCTION IF EXISTS public."${functionName}" CASCADE;
            `
          });
          
          if (dropFunctionError) {
            console.error(`Error dropping function ${functionName}:`, dropFunctionError);
          } else {
            console.log(`Function ${functionName} dropped successfully.`);
          }
        }
      } else {
        console.log('No functions found in public schema.');
      }
    }
    
    // 5. Get list of all triggers
    console.log('\n--- Getting list of triggers ---');
    
    const { data: triggers, error: triggersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT trigger_name, event_object_table, event_object_schema
        FROM information_schema.triggers;
      `
    });
    
    if (triggersError) {
      console.error('Error getting triggers:', triggersError);
    } else {
      console.log('Triggers:', triggers);
      
      // 6. Drop all triggers
      console.log('\n--- Dropping all triggers ---');
      
      if (triggers && triggers.length > 0) {
        for (const trigger of triggers) {
          const triggerName = trigger.trigger_name;
          const tableName = trigger.event_object_table;
          const schemaName = trigger.event_object_schema;
          
          console.log(`Dropping trigger: ${triggerName} on ${schemaName}.${tableName}`);
          
          const { error: dropTriggerError } = await supabase.rpc('execute_sql', {
            sql_query: `
              DROP TRIGGER IF EXISTS "${triggerName}" ON ${schemaName}."${tableName}" CASCADE;
            `
          });
          
          if (dropTriggerError) {
            console.error(`Error dropping trigger ${triggerName}:`, dropTriggerError);
          } else {
            console.log(`Trigger ${triggerName} dropped successfully.`);
          }
        }
      } else {
        console.log('No triggers found.');
      }
    }
    
    // 7. Get list of all policies
    console.log('\n--- Getting list of policies ---');
    
    const { data: policies, error: policiesError } = await supabase.rpc('execute_sql', {
      sql_query: `
        SELECT polname, tablename
        FROM pg_policy
        JOIN pg_class ON pg_policy.polrelid = pg_class.oid;
      `
    });
    
    if (policiesError) {
      console.error('Error getting policies:', policiesError);
    } else {
      console.log('Policies:', policies);
      
      // 8. Drop all policies
      console.log('\n--- Dropping all policies ---');
      
      if (policies && policies.length > 0) {
        for (const policy of policies) {
          const policyName = policy.polname;
          const tableName = policy.tablename;
          
          console.log(`Dropping policy: ${policyName} on ${tableName}`);
          
          const { error: dropPolicyError } = await supabase.rpc('execute_sql', {
            sql_query: `
              DROP POLICY IF EXISTS "${policyName}" ON public."${tableName}";
            `
          });
          
          if (dropPolicyError) {
            console.error(`Error dropping policy ${policyName}:`, dropPolicyError);
          } else {
            console.log(`Policy ${policyName} dropped successfully.`);
          }
        }
      } else {
        console.log('No policies found.');
      }
    }
    
    // 9. Ask if user wants to delete all users
    const deleteUsers = process.argv.includes('--delete-users');
    
    if (deleteUsers) {
      console.log('\n--- Deleting all users ---');
      
      // Delete all users except the current one
      const { error: deleteUsersError } = await supabase.rpc('execute_sql', {
        sql_query: `
          DELETE FROM auth.users;
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
    
    console.log('\nDatabase cleanup completed!');
  } catch (error) {
    console.error('Unexpected error during database cleanup:', error);
  }
}

// Run the function
cleanDatabase();
