
-- Create a new enum type for discount types (percentage or fixed amount)
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed_amount');

-- Create a new enum type for targeting specific user segments
CREATE TYPE public.user_segment_type AS ENUM ('all', 'new_users', 'returning_users', 'specific_users');

-- Create the table to store and manage discount codes
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type public.discount_type NOT NULL,
  discount_value NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  usage_limit INT,
  times_used INT NOT NULL DEFAULT 0,
  user_segment public.user_segment_type NOT NULL DEFAULT 'all',
  specific_user_ids UUID[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments for clarity
COMMENT ON TABLE public.discount_codes IS 'Stores promotional discount codes created by admins.';
COMMENT ON COLUMN public.discount_codes.code IS 'The unique, user-facing discount code.';
COMMENT ON COLUMN public.discount_codes.discount_type IS 'Whether the discount is a percentage or a fixed amount.';
COMMENT ON COLUMN public.discount_codes.discount_value IS 'The value of the discount (e.g., 10 for 10% or 10 for $10).';
COMMENT ON COLUMN public.discount_codes.is_active IS 'Whether the code can be currently used.';
COMMENT ON COLUMN public.discount_codes.expires_at IS 'Optional expiration date for the code.';
COMMENT ON COLUMN public.discount_codes.usage_limit IS 'Optional total number of times the code can be used across all users.';
COMMENT ON COLUMN public.discount_codes.times_used IS 'How many times the code has been successfully used.';
COMMENT ON COLUMN public.discount_codes.user_segment IS 'Which group of users the code applies to (e.g., all, new, or specific).';
COMMENT ON COLUMN public.discount_codes.specific_user_ids IS 'Array of user IDs if segment is ''specific_users''.';

-- Enable Row Level Security for discount codes
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active discount codes so they can be validated on the client
CREATE POLICY "Allow public read access to active discount codes"
ON public.discount_codes
FOR SELECT
USING (is_active = TRUE AND (expires_at IS NULL OR expires_at > now()));

-- Add discount-related columns to the affiliates table
ALTER TABLE public.affiliates
ADD COLUMN has_discount BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN affiliate_discount_type public.discount_type,
ADD COLUMN affiliate_discount_value NUMERIC;

-- Add comments for new affiliate columns
COMMENT ON COLUMN public.affiliates.has_discount IS 'If true, this affiliate''s code also acts as a discount code.';
COMMENT ON COLUMN public.affiliates.affiliate_discount_type IS 'The type of discount provided by the affiliate (percentage or fixed).';
COMMENT ON COLUMN public.affiliates.affiliate_discount_value IS 'The value of the discount provided by the affiliate.';

-- Add columns to the orders table to track applied discounts
ALTER TABLE public.orders
ADD COLUMN applied_discount_code TEXT,
ADD COLUMN discount_amount NUMERIC DEFAULT 0;

-- Add comments for new order columns
COMMENT ON COLUMN public.orders.applied_discount_code IS 'The discount or affiliate code that was applied to this order.';
COMMENT ON COLUMN public.orders.discount_amount IS 'The total discount amount applied to the order.';

-- This function creates a pending referral when a new order with an affiliate code is created.
-- It is updated to calculate commission on the post-discount price.
CREATE OR REPLACE FUNCTION public.handle_new_order_create_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  affiliate_record RECORD;
  calculated_commission NUMERIC;
  commissionable_amount NUMERIC;
BEGIN
  -- Check if the new order has an affiliate code
  IF NEW.affiliate_code IS NOT NULL THEN
    -- Find the approved affiliate using the code
    SELECT id, commission_rate
    INTO affiliate_record
    FROM public.affiliates
    WHERE affiliate_code = NEW.affiliate_code AND status = 'approved';

    -- If a valid, approved affiliate is found
    IF FOUND THEN
      -- Calculate commissionable amount (total price minus discount)
      commissionable_amount := NEW.total_price - COALESCE(NEW.discount_amount, 0);
      
      -- Calculate commission based on the affiliate's current rate
      -- Ensure commission is not negative
      calculated_commission := GREATEST(0, commissionable_amount * affiliate_record.commission_rate);

      -- Insert a new record into affiliate_referrals with a 'pending' status
      INSERT INTO public.affiliate_referrals (affiliate_id, order_id, referred_user_id, commission_amount, status)
      VALUES (affiliate_record.id, NEW.id, NEW.user_id, calculated_commission, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
