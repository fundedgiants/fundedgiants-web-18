
-- Add a column to store payment information (e.g., crypto wallet details)
ALTER TABLE public.affiliates
ADD COLUMN payment_info jsonb;
