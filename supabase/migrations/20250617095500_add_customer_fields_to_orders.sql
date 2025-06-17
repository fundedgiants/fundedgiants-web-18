
-- Add customer information fields to orders table for guest checkouts
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_first_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_last_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_country TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_state TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_zip_code TEXT;

-- Add payment reference field for external payment providers
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Add index for payment reference lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);

-- Update the existing send-purchase-to-crm function to handle the new customer fields
-- This ensures the CRM integration works with the customer data stored in orders
