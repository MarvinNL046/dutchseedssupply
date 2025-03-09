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
