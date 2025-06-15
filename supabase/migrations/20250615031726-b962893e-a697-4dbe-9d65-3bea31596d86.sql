
-- Create affiliates table to store affiliate-specific data for each user
CREATE TABLE public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    affiliate_code TEXT NOT NULL UNIQUE,
    commission_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.10, -- Default 10% commission
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security for affiliates table
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Affiliates can only view their own data
CREATE POLICY "Affiliates can view their own data"
ON public.affiliates
FOR SELECT
USING (auth.uid() = user_id);

-- This function automatically creates an affiliate profile for every new user
CREATE OR REPLACE FUNCTION public.handle_new_user_create_affiliate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Inserts a new affiliate record with a random 8-character unique code
  INSERT INTO public.affiliates (user_id, affiliate_code)
  VALUES (new.id, upper(substring(md5(random()::text) for 8)));
  RETURN new;
END;
$$;

-- This trigger executes the function whenever a new user is created
CREATE TRIGGER on_auth_user_created_create_affiliate
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_create_affiliate();

-- Add a column to orders table to track which affiliate referred the sale
ALTER TABLE public.orders
ADD COLUMN affiliate_code TEXT;

-- Create affiliate_referrals table to track successful referrals and commissions
CREATE TABLE public.affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    commission_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- e.g., pending, completed, cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for affiliate_referrals
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Affiliates can only view their own referrals
CREATE POLICY "Affiliates can view their own referrals"
ON public.affiliate_referrals
FOR SELECT
USING (affiliate_id = (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- Create affiliate_payouts table to manage affiliate earnings withdrawals
CREATE TABLE public.affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- e.g., pending, processing, paid, failed
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Enable RLS for affiliate_payouts
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Affiliates can view their own payout history
CREATE POLICY "Affiliates can view their own payouts"
ON public.affiliate_payouts
FOR SELECT
USING (affiliate_id = (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- RLS Policy: Affiliates can create new payout requests
CREATE POLICY "Affiliates can create payout requests"
ON public.affiliate_payouts
FOR INSERT
WITH CHECK (affiliate_id = (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- Create affiliate_clicks table to track referral link clicks
CREATE TABLE public.affiliate_clicks (
    id BIGSERIAL PRIMARY KEY,
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT
);

-- Enable RLS for affiliate_clicks
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Affiliates can view their own click data
CREATE POLICY "Affiliates can view their own clicks"
ON public.affiliate_clicks
FOR SELECT
USING (affiliate_id = (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

