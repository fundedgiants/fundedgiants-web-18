
-- Add columns to orders table for payment tracking
ALTER TABLE public.orders
ADD COLUMN payment_method TEXT,
ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN payment_provider TEXT,
ADD COLUMN payment_provider_invoice_id TEXT;

-- Enable Row Level Security on the orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update their own orders
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id);


-- Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);
