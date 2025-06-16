
-- Create function to get all affiliates with stats
CREATE OR REPLACE FUNCTION public.get_all_affiliates_with_stats()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  user_email text,
  affiliate_code text,
  status text,
  tier text,
  commission_rate numeric,
  total_clicks bigint,
  total_referrals bigint,
  total_earnings numeric,
  pending_earnings numeric,
  created_at timestamp with time zone,
  personal_info jsonb,
  social_media_urls jsonb,
  promotion_methods text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  RETURN QUERY
  SELECT
    a.id,
    a.user_id,
    u.email AS user_email,
    a.affiliate_code,
    a.status,
    a.tier,
    a.commission_rate,
    COALESCE(click_stats.total_clicks, 0) AS total_clicks,
    COALESCE(referral_stats.total_referrals, 0) AS total_referrals,
    COALESCE(referral_stats.total_earnings, 0) AS total_earnings,
    COALESCE(referral_stats.pending_earnings, 0) AS pending_earnings,
    a.created_at,
    a.personal_info,
    a.social_media_urls,
    a.promotion_methods
  FROM
    public.affiliates a
  LEFT JOIN
    auth.users u ON a.user_id = u.id
  LEFT JOIN (
    SELECT 
      affiliate_id,
      COUNT(*) AS total_clicks
    FROM public.affiliate_clicks
    GROUP BY affiliate_id
  ) click_stats ON a.id = click_stats.affiliate_id
  LEFT JOIN (
    SELECT 
      affiliate_id,
      COUNT(*) AS total_referrals,
      SUM(CASE WHEN status = 'completed' THEN commission_amount ELSE 0 END) AS total_earnings,
      SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END) AS pending_earnings
    FROM public.affiliate_referrals
    GROUP BY affiliate_id
  ) referral_stats ON a.id = referral_stats.affiliate_id
  ORDER BY a.created_at DESC;
END;
$function$;

-- Create function to update affiliate status
CREATE OR REPLACE FUNCTION public.update_affiliate_status(target_affiliate_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  UPDATE public.affiliates
  SET status = new_status
  WHERE id = target_affiliate_id;
END;
$function$;

-- Create function to update affiliate commission rate
CREATE OR REPLACE FUNCTION public.update_affiliate_commission_rate(target_affiliate_id uuid, new_rate numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  UPDATE public.affiliates
  SET commission_rate = new_rate
  WHERE id = target_affiliate_id;
END;
$function$;

-- Create function to get all trading accounts with details
CREATE OR REPLACE FUNCTION public.get_all_trading_accounts_with_details()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  user_email text,
  user_name text,
  login_id text,
  program_name text,
  platform text,
  starting_balance numeric,
  status text,
  is_visible boolean,
  profit_protect boolean,
  bi_weekly_payout boolean,
  order_id uuid,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  RETURN QUERY
  SELECT
    ta.id,
    ta.user_id,
    u.email AS user_email,
    COALESCE(p.first_name || ' ' || p.last_name, 'Unknown') AS user_name,
    ta.login_id,
    ta.program_name,
    ta.platform::text,
    ta.starting_balance,
    ta.status::text,
    ta.is_visible,
    ta.profit_protect,
    ta.bi_weekly_payout,
    ta.order_id,
    ta.created_at
  FROM
    public.trading_accounts ta
  LEFT JOIN
    auth.users u ON ta.user_id = u.id
  LEFT JOIN
    public.profiles p ON ta.user_id = p.id
  ORDER BY ta.created_at DESC;
END;
$function$;

-- Create function to update trading account status
CREATE OR REPLACE FUNCTION public.update_trading_account_status(target_account_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  UPDATE public.trading_accounts
  SET status = new_status::trading_account_status
  WHERE id = target_account_id;
END;
$function$;

-- Create function to get all discount codes with stats
CREATE OR REPLACE FUNCTION public.get_all_discount_codes_with_stats()
RETURNS TABLE(
  id uuid,
  code text,
  discount_type text,
  discount_value numeric,
  is_active boolean,
  usage_limit integer,
  times_used integer,
  user_segment text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone,
  total_revenue_impact numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  RETURN QUERY
  SELECT
    dc.id,
    dc.code,
    dc.discount_type::text,
    dc.discount_value,
    dc.is_active,
    dc.usage_limit,
    dc.times_used,
    dc.user_segment::text,
    dc.expires_at,
    dc.created_at,
    COALESCE(revenue_impact.total_impact, 0) AS total_revenue_impact
  FROM
    public.discount_codes dc
  LEFT JOIN (
    SELECT 
      applied_discount_code,
      SUM(COALESCE(discount_amount, 0)) AS total_impact
    FROM public.orders
    WHERE applied_discount_code IS NOT NULL
    GROUP BY applied_discount_code
  ) revenue_impact ON dc.code = revenue_impact.applied_discount_code
  ORDER BY dc.created_at DESC;
END;
$function$;

-- Create function to create discount code
CREATE OR REPLACE FUNCTION public.create_discount_code(
  p_code text,
  p_discount_type text,
  p_discount_value numeric,
  p_usage_limit integer DEFAULT NULL,
  p_user_segment text DEFAULT 'all',
  p_expires_at timestamp with time zone DEFAULT NULL,
  p_specific_user_ids uuid[] DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_discount_id uuid;
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  INSERT INTO public.discount_codes (
    code,
    discount_type,
    discount_value,
    usage_limit,
    user_segment,
    expires_at,
    specific_user_ids
  )
  VALUES (
    p_code,
    p_discount_type::discount_type,
    p_discount_value,
    p_usage_limit,
    p_user_segment::user_segment_type,
    p_expires_at,
    p_specific_user_ids
  )
  RETURNING id INTO new_discount_id;

  RETURN new_discount_id;
END;
$function$;

-- Create function to update discount code
CREATE OR REPLACE FUNCTION public.update_discount_code(
  p_id uuid,
  p_is_active boolean DEFAULT NULL,
  p_usage_limit integer DEFAULT NULL,
  p_expires_at timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  UPDATE public.discount_codes
  SET 
    is_active = COALESCE(p_is_active, is_active),
    usage_limit = COALESCE(p_usage_limit, usage_limit),
    expires_at = COALESCE(p_expires_at, expires_at)
  WHERE id = p_id;
END;
$function$;

-- Create function to get affiliate payouts
CREATE OR REPLACE FUNCTION public.get_affiliate_payouts()
RETURNS TABLE(
  id uuid,
  affiliate_id uuid,
  affiliate_code text,
  user_email text,
  amount numeric,
  status text,
  requested_at timestamp with time zone,
  processed_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  RETURN QUERY
  SELECT
    ap.id,
    ap.affiliate_id,
    a.affiliate_code,
    u.email AS user_email,
    ap.amount,
    ap.status,
    ap.requested_at,
    ap.processed_at
  FROM
    public.affiliate_payouts ap
  LEFT JOIN
    public.affiliates a ON ap.affiliate_id = a.id
  LEFT JOIN
    auth.users u ON a.user_id = u.id
  ORDER BY ap.requested_at DESC;
END;
$function$;

-- Create function to update payout status
CREATE OR REPLACE FUNCTION public.update_payout_status(target_payout_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  UPDATE public.affiliate_payouts
  SET 
    status = new_status,
    processed_at = CASE WHEN new_status = 'completed' THEN now() ELSE processed_at END
  WHERE id = target_payout_id;
END;
$function$;
