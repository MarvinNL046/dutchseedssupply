#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL for creating the products schema
const productsSchema = `
-- Make sure the uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'in_stock',
  featured BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  thc_content DECIMAL(5, 2),
  cbd_content DECIMAL(5, 2),
  flowering_time INTEGER,
  height TEXT,
  yield TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product translations table
CREATE TABLE IF NOT EXISTS product_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, language_code)
);

-- Create product_categories junction table
CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at timestamp
DROP TRIGGER IF EXISTS update_products_modtime ON products;
CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_product_translations_modtime ON product_translations;
CREATE TRIGGER update_product_translations_modtime
BEFORE UPDATE ON product_translations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
DROP POLICY IF EXISTS products_select_policy ON products;
CREATE POLICY products_select_policy ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS products_insert_update_delete_policy ON products;
CREATE POLICY products_insert_update_delete_policy ON products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for product_translations
DROP POLICY IF EXISTS product_translations_select_policy ON product_translations;
CREATE POLICY product_translations_select_policy ON product_translations
  FOR SELECT USING (true);

DROP POLICY IF EXISTS product_translations_insert_update_delete_policy ON product_translations;
CREATE POLICY product_translations_insert_update_delete_policy ON product_translations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for categories
DROP POLICY IF EXISTS categories_select_policy ON categories;
CREATE POLICY categories_select_policy ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS categories_insert_update_delete_policy ON categories;
CREATE POLICY categories_insert_update_delete_policy ON categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for product_categories
DROP POLICY IF EXISTS product_categories_select_policy ON product_categories;
CREATE POLICY product_categories_select_policy ON product_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS product_categories_insert_update_delete_policy ON product_categories;
CREATE POLICY product_categories_insert_update_delete_policy ON product_categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create views for easier querying
CREATE OR REPLACE VIEW product_with_categories AS
SELECT 
  p.*,
  array_agg(c.name) as categories
FROM 
  products p
LEFT JOIN 
  product_categories pc ON p.id = pc.product_id
LEFT JOIN 
  categories c ON pc.category_id = c.id
GROUP BY 
  p.id;

CREATE OR REPLACE VIEW product_with_translations AS
SELECT 
  p.*,
  jsonb_object_agg(pt.language_code, jsonb_build_object(
    'description', pt.description,
    'meta_title', pt.meta_title,
    'meta_description', pt.meta_description
  )) as translations
FROM 
  products p
LEFT JOIN 
  product_translations pt ON p.id = pt.product_id
GROUP BY 
  p.id;
`;

// SQL for inserting default categories
const defaultCategories = `
-- Insert default categories
INSERT INTO categories (name, slug)
VALUES 
  ('Indica', 'indica'),
  ('Sativa', 'sativa'),
  ('Hybrid', 'hybrid'),
  ('Autoflowering', 'autoflowering'),
  ('Feminized', 'feminized'),
  ('CBD', 'cbd')
ON CONFLICT (slug) DO NOTHING;
`;

// SQL for inserting a sample product
const sampleProduct = `
-- Insert a sample product
INSERT INTO products (
  sku,
  name,
  slug,
  price,
  stock_quantity,
  stock_status,
  featured,
  images,
  thc_content,
  cbd_content,
  flowering_time,
  height,
  yield
) VALUES (
  'DSS-001',
  'Northern Lights',
  'northern-lights',
  29.99,
  100,
  'in_stock',
  true,
  '[{"url": "northern-lights-1.jpg", "alt": "Northern Lights"}, {"url": "northern-lights-2.jpg", "alt": "Northern Lights Plant"}]',
  18.5,
  0.2,
  56,
  '100-120cm',
  '450-550g/m²'
)
ON CONFLICT (slug) DO NOTHING
RETURNING id;
`;

// SQL for inserting translations for the sample product
const sampleTranslations = `
-- Insert translations for the sample product
WITH product AS (
  SELECT id FROM products WHERE slug = 'northern-lights'
)
INSERT INTO product_translations (product_id, language_code, description)
SELECT 
  product.id,
  lang.code,
  lang.description
FROM 
  product,
  (VALUES 
    ('en', 'Northern Lights is one of the most famous indica strains of all time. Known for its resinous buds and resilience during growth.'),
    ('nl', 'Northern Lights is een van de meest bekende indica-soorten aller tijden. Bekend om zijn harsachtige toppen en veerkracht tijdens de groei.'),
    ('de', 'Northern Lights ist eine der bekanntesten Indica-Sorten aller Zeiten. Bekannt für seine harzigen Knospen und Widerstandsfähigkeit während des Wachstums.'),
    ('fr', 'Northern Lights est l''une des variétés indica les plus célèbres de tous les temps. Connue pour ses bourgeons résineux et sa résilience pendant la croissance.')
  ) AS lang(code, description)
ON CONFLICT (product_id, language_code) DO NOTHING;
`;

// SQL for linking the sample product to categories
const sampleCategories = `
-- Link the sample product to categories
WITH product AS (
  SELECT id FROM products WHERE slug = 'northern-lights'
),
categories AS (
  SELECT id FROM categories WHERE slug IN ('indica', 'feminized')
)
INSERT INTO product_categories (product_id, category_id)
SELECT 
  product.id,
  categories.id
FROM 
  product,
  categories
ON CONFLICT (product_id, category_id) DO NOTHING;
`;

async function executeSQL(sql, description) {
  console.log(`Executing: ${description}...`);
  const { error } = await supabase.rpc('pgmoon.query', { query: sql });
  
  if (error) {
    console.error(`Error executing ${description}:`, error);
    return false;
  }
  
  console.log(`Successfully executed: ${description}`);
  return true;
}

async function main() {
  console.log('Setting up products schema...');
  
  // Execute the SQL statements
  await executeSQL(productsSchema, 'Products schema');
  await executeSQL(defaultCategories, 'Default categories');
  await executeSQL(sampleProduct, 'Sample product');
  await executeSQL(sampleTranslations, 'Sample translations');
  await executeSQL(sampleCategories, 'Sample categories');
  
  console.log('Products schema setup complete!');
}

main().catch(err => {
  console.error('Error setting up products schema:', err);
  process.exit(1);
});
