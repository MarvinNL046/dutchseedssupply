-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_orders_order_code;
DROP INDEX IF EXISTS idx_orders_payment_provider_ref;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_user_id;

-- Drop existing table if it exists
DROP TABLE IF EXISTS orders;

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT,
  customer_city TEXT,
  customer_postal_code TEXT,
  customer_country TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  domain_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_provider_ref TEXT,
  payment_id TEXT,
  payment_method TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX idx_orders_order_code ON orders(order_code);
CREATE INDEX idx_orders_payment_provider_ref ON orders(payment_provider_ref);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Create RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS admin_all_orders ON orders;
DROP POLICY IF EXISTS user_own_orders ON orders;
DROP POLICY IF EXISTS insert_orders ON orders;

-- Policy for admins (can see all orders)
CREATE POLICY admin_all_orders ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Policy for users (can only see their own orders)
CREATE POLICY user_own_orders ON orders
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for inserting orders (anyone can create an order)
CREATE POLICY insert_orders ON orders
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_order_status(UUID, TEXT);
DROP FUNCTION IF EXISTS get_orders_by_status(TEXT);

-- Create function to update order status
CREATE FUNCTION update_order_status(
  order_id UUID,
  new_status TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE orders
  SET status = new_status
  WHERE id = order_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get orders by status
CREATE FUNCTION get_orders_by_status(
  status_filter TEXT
) RETURNS SETOF orders AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM orders
  WHERE status = status_filter
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;
