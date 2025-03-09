-- Products Schema for Dutch Seed Supply
-- This file contains the SQL schema for the products database

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
  stock_status TEXT NOT NULL DEFAULT 'in_stock', -- in_stock, low_stock, out_of_stock
  featured BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  thc_content DECIMAL(5, 2),
  cbd_content DECIMAL(5, 2),
  flowering_time INTEGER, -- in days
  height TEXT, -- e.g. "100-150cm"
  yield TEXT, -- e.g. "400-500g/m²"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product translations table
CREATE TABLE IF NOT EXISTS product_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL, -- nl, de, fr, en
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
