
-- Create custom types for trading account status and platform
CREATE TYPE trading_account_status AS ENUM ('active', 'passed', 'failed', 'inactive');
CREATE TYPE trading_platform AS ENUM ('MT4', 'MT5', 'HT5');

-- Create a table for trading accounts
CREATE TABLE public.trading_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  login_id TEXT NOT NULL UNIQUE,
  program_name TEXT NOT NULL,
  status trading_account_status NOT NULL DEFAULT 'active',
  platform trading_platform NOT NULL,
  starting_balance NUMERIC(12, 2) NOT NULL,
  profit_protect BOOLEAN NOT NULL DEFAULT false,
  bi_weekly_payout BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments to the columns
COMMENT ON COLUMN public.trading_accounts.login_id IS 'The login ID for the trading platform account';
COMMENT ON COLUMN public.trading_accounts.status IS 'The current status of the trading account';
COMMENT ON COLUMN public.trading_accounts.platform IS 'The trading platform for the account';

-- Enable Row Level Security
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own trading accounts
CREATE POLICY "Users can view their own trading accounts."
  ON public.trading_accounts FOR SELECT
  USING (auth.uid() = user_id);
