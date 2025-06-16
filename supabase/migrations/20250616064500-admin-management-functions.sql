
-- Function to get all affiliates with their performance stats
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
    created_at timestamptz,
    personal_info jsonb,
    social_media_urls jsonb,
    promotion_methods text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
    END IF;

    RETURN QUERY
    SELECT
        a.id,
        a.user_id,
        u.email as user_email,
        a.affiliate_code,
        a.status,
        a.tier,
        a.commission_rate,
        COALESCE(clicks.total_clicks, 0) as total_clicks,
        COALESCE(referrals.total_referrals, 0) as total_referrals,
        COALESCE(referrals.total_earnings, 0) as total_earnings,
        COALESCE(referrals.pending_earnings, 0) as pending_earnings,
        a.created_at,
        a.personal_info,
        a.social_media_urls,
        a.promotion_methods
    FROM public.affiliates a
    LEFT JOIN auth.users u ON a.user_id = u.id
    LEFT JOIN (
        SELECT affiliate_id, COUNT(*) as total_clicks
        FROM public.affiliate_clicks
        GROUP BY affiliate_id
    ) clicks ON a.id = clicks.affiliate_id
    LEFT JOIN (
        SELECT 
            affiliate_id,
            COUNT(*) as total_referrals,
            SUM(CASE WHEN status = 'completed' THEN commission_amount ELSE 0 END) as total_earnings,
            SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END) as pending_earnings
        FROM public.affiliate_referrals
        GROUP BY affiliate_id
    ) referrals ON a.id = referrals.affiliate_id
    ORDER BY a.created_at DESC;
END;
$$;

-- Function to update affiliate status (approve/reject applications)
CREATE OR REPLACE FUNCTION public.update_affiliate_status(
    target_affiliate_id uuid,
    new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
    END IF;

    -- Validate status
    IF new_status NOT IN ('pending', 'approved', 'rejected') THEN
        RAISE EXCEPTION 'Invalid status. Must be pending, approved, or rejected.';
    END IF;

    UPDATE public.affiliates
    SET status = new_status
    WHERE id = target_affiliate_id;
END;
$$;

-- Function to update affiliate commission rate
CREATE OR REPLACE FUNCTION public.update_affiliate_commission_rate(
    target_affiliate_id uuid,
    new_commission_rate numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
    END IF;

    -- Validate commission rate (between 0 and 0.5 = 50%)
    IF new_commission_rate < 0 OR new_commission_rate > 0.5 THEN
        RAISE EXCEPTION 'Commission rate must be between 0 and 0.5 (50%%).';
    END IF;

    UPDATE public.affiliates
    SET commission_rate = new_commission_rate
    WHERE id = target_affiliate_id;
END;
$$;

-- Function to get all trading accounts with details
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
    created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
    END IF;

    RETURN QUERY
    SELECT
        ta.id,
        ta.user_id,
        u.email as user_email,
        COALESCE(p.first_name || ' ' || p.last_name, 'Unknown') as user_name,
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
    FROM public.trading_accounts ta
    LEFT JOIN auth.users u ON ta.user_id = u.id
    LEFT JOIN public.profiles p ON ta.user_id = p.id
    ORDER BY ta.created_at DESC;
END;
$$;

-- Function to update trading account status
CREATE OR REPLACE FUNCTION public.update_trading_account_status(
    target_account_id uuid,
    new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
    END IF;

    -- Validate status
    IF new_status NOT IN ('active', 'passed', 'failed', 'inactive') THEN
        RAISE EXCEPTION 'Invalid status. Must be active, passed, failed, or inactive.';
    END IF;

    UPDATE public.trading_accounts
    SET status = new_status::trading_account_status
    WHERE id = target_account_id;
END;
$$;

-- Function to get all discount codes with usage statistics
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
    expires_at timestamptz,
    created_at timestamptz,
    total_revenue_impact numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
        COALESCE(usage_stats.total_revenue_impact, 0) as total_revenue_impact
    FROM public.discount_codes dc
    LEFT JOIN (
        SELECT 
            applied_discount_code,
            SUM(discount_amount) as total_revenue_impact
        FROM public.orders
        WHERE applied_discount_code IS NOT NULL
        GROUP BY applied_discount_code
    ) usage_stats ON dc.code = usage_stats.applied_discount_code
    ORDER BY dc.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_all_affiliates_with_stats() IS 'Returns all affiliates with their performance statistics. For admin use only.';
COMMENT ON FUNCTION public.update_affiliate_status(uuid, text) IS 'Updates the status of an affiliate application. For admin use only.';
COMMENT ON FUNCTION public.update_affiliate_commission_rate(uuid, numeric) IS 'Updates the commission rate for an affiliate. For admin use only.';
COMMENT ON FUNCTION public.get_all_trading_accounts_with_details() IS 'Returns all trading accounts with user details. For admin use only.';
COMMENT ON FUNCTION public.update_trading_account_status(uuid, text) IS 'Updates the status of a trading account. For admin use only.';
COMMENT ON FUNCTION public.get_all_discount_codes_with_stats() IS 'Returns all discount codes with usage statistics. For admin use only.';
