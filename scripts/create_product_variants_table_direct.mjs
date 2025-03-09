import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

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

async function createProductVariantsTable() {
  console.log('Creating product_variants table...');
  
  try {
    // Create the product_variants table
    const { error: createTableError } = await supabase.from('product_variants').select('id').limit(1);
    
    if (createTableError && createTableError.code === 'PGRST116') {
      console.log('Table does not exist, creating it...');
      
      // Execute SQL to create the table
      const { error } = await supabase.auth.admin.executeSql(`
        CREATE TABLE IF NOT EXISTS product_variants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          domain_id TEXT NOT NULL, -- nl, com, de, fr
          price DECIMAL(10, 2) NOT NULL,
          sale_price DECIMAL(10, 2),
          stock_quantity INTEGER NOT NULL DEFAULT 0,
          stock_status TEXT NOT NULL DEFAULT 'in_stock',
          available BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(product_id, domain_id)
        );
        
        -- Create trigger to update updated_at timestamp
        DROP TRIGGER IF EXISTS update_product_variants_modtime ON product_variants;
        CREATE TRIGGER update_product_variants_modtime
        BEFORE UPDATE ON product_variants
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
        
        -- Enable Row Level Security
        ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies for product_variants
        DROP POLICY IF EXISTS product_variants_select_policy ON product_variants;
        CREATE POLICY product_variants_select_policy ON product_variants
          FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS product_variants_insert_update_delete_policy ON product_variants;
        CREATE POLICY product_variants_insert_update_delete_policy ON product_variants
          FOR ALL TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
            )
          );
      `);
      
      if (error) {
        console.error('Error creating table:', error);
        return;
      }
      
      console.log('Table created successfully!');
    } else if (createTableError) {
      console.error('Error checking if table exists:', createTableError);
      return;
    } else {
      console.log('Table already exists, skipping creation.');
    }
    
    // Insert sample data
    console.log('Inserting sample data...');
    
    // First, get the product ID for Northern Lights
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', 'northern-lights')
      .limit(1);
    
    if (productError) {
      console.error('Error fetching product:', productError);
      return;
    }
    
    if (!products || products.length === 0) {
      console.error('Product "northern-lights" not found.');
      return;
    }
    
    const productId = products[0].id;
    
    // Insert variants for each domain
    const domains = ['nl', 'com', 'de', 'fr'];
    const prices = { nl: 29.99, com: 32.99, de: 31.99, fr: 33.99 };
    const stocks = { nl: 100, com: 75, de: 50, fr: 25 };
    
    for (const domain of domains) {
      // Check if variant already exists
      const { data: existingVariants, error: checkError } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', productId)
        .eq('domain_id', domain)
        .limit(1);
      
      if (checkError) {
        console.error(`Error checking if variant exists for domain ${domain}:`, checkError);
        continue;
      }
      
      if (existingVariants && existingVariants.length > 0) {
        console.log(`Variant for domain ${domain} already exists, skipping.`);
        continue;
      }
      
      // Insert new variant
      const { error: insertError } = await supabase
        .from('product_variants')
        .insert({
          product_id: productId,
          domain_id: domain,
          price: prices[domain],
          stock_quantity: stocks[domain],
          available: true
        });
      
      if (insertError) {
        console.error(`Error inserting variant for domain ${domain}:`, insertError);
      } else {
        console.log(`Inserted variant for domain ${domain}.`);
      }
    }
    
    console.log('Sample data insertion completed.');
    
  } catch (err) {
    console.error('Error in createProductVariantsTable:', err);
  }
}

// Run the function
createProductVariantsTable();
