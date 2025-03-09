import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

async function executeQuery(query, description) {
  console.log(`\n--- ${description} ---`);
  try {
    // Use the REST API to execute the query
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: query
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error executing query for ${description}:`, errorText);
      return false;
    }
    
    console.log(`Successfully executed: ${description}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error executing query for ${description}:`, error);
    return false;
  }
}

async function createProductVariantsTable() {
  console.log('Creating product_variants table...');
  
  // SQL to create the product_variants table
  const createTableSQL = `
    -- Create product_variants table
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
  `;
  
  // Execute the SQL to create the table
  const tableCreated = await executeQuery(createTableSQL, 'Create product_variants table');
  
  if (!tableCreated) {
    console.error('Failed to create product_variants table.');
    return;
  }
  
  // SQL to insert sample data for the existing product
  const insertSampleDataSQL = `
    -- Insert sample data for the existing product
    WITH product AS (
      SELECT id FROM products WHERE slug = 'northern-lights'
    )
    INSERT INTO product_variants (product_id, domain_id, price, stock_quantity)
    SELECT 
      product.id,
      domain.id,
      CASE 
        WHEN domain.id = 'nl' THEN 29.99
        WHEN domain.id = 'com' THEN 32.99
        WHEN domain.id = 'de' THEN 31.99
        WHEN domain.id = 'fr' THEN 33.99
      END,
      CASE 
        WHEN domain.id = 'nl' THEN 100
        WHEN domain.id = 'com' THEN 75
        WHEN domain.id = 'de' THEN 50
        WHEN domain.id = 'fr' THEN 25
      END
    FROM 
      product,
      (VALUES 
        ('nl'),
        ('com'),
        ('de'),
        ('fr')
      ) AS domain(id)
    ON CONFLICT (product_id, domain_id) DO NOTHING;
  `;
  
  // Execute the SQL to insert sample data
  const sampleDataInserted = await executeQuery(insertSampleDataSQL, 'Insert sample data');
  
  if (!sampleDataInserted) {
    console.error('Failed to insert sample data.');
    return;
  }
  
  console.log('Product_variants table created and sample data inserted successfully!');
}

// Run the function
createProductVariantsTable().catch(err => {
  console.error('Error in createProductVariantsTable:', err);
});
