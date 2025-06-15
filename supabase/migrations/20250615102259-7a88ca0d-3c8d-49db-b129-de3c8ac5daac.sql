
-- Function to get all orders with user details for admin view
CREATE OR REPLACE FUNCTION public.get_all_orders_with_details()
RETURNS TABLE (
    id uuid,
    user_id uuid,
    user_email text,
    program_name text,
    total_price numeric,
    payment_status text,
    payment_method text,
    payment_provider text,
    created_at timestamptz,
    affiliate_code text,
    applied_discount_code text
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
        o.id,
        o.user_id,
        u.email AS user_email,
        o.program_name,
        o.total_price,
        o.payment_status,
        o.payment_method,
        o.payment_provider,
        o.created_at,
        o.affiliate_code,
        o.applied_discount_code
    FROM
        public.orders o
    LEFT JOIN
        auth.users u ON o.user_id = u.id
    ORDER BY
        o.created_at DESC;
END;
$$;
COMMENT ON FUNCTION public.get_all_orders_with_details() IS 'Returns a list of all orders with associated user email. For admin use only.';

-- Function to update the payment status of an order
CREATE OR REPLACE FUNCTION public.update_order_payment_status(
    target_order_id uuid,
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

    UPDATE public.orders
    SET payment_status = new_status
    WHERE id = target_order_id;
END;
$$;
COMMENT ON FUNCTION public.update_order_payment_status(uuid, text) IS 'Updates the payment status of a specific order. Can only be called by an admin.';

-- Drop existing type and function to avoid conflicts
DROP FUNCTION IF EXISTS public.get_order_analytics();
DROP TYPE IF EXISTS public.order_analytics CASCADE;

-- Type for order analytics result
CREATE TYPE public.order_analytics AS (
    total_revenue numeric,
    total_orders bigint,
    pending_orders bigint,
    completed_orders bigint,
    failed_orders bigint,
    refunded_orders bigint,
    cancelled_orders bigint
);

-- Function to get order analytics
CREATE OR REPLACE FUNCTION public.get_order_analytics()
RETURNS public.order_analytics
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    analytics_result public.order_analytics;
BEGIN
    -- Check if the current user is an admin
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
    END IF;

    SELECT
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN total_price ELSE 0 END), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE payment_status = 'pending'),
        COUNT(*) FILTER (WHERE payment_status = 'completed'),
        COUNT(*) FILTER (WHERE payment_status = 'failed'),
        COUNT(*) FILTER (WHERE payment_status = 'refunded'),
        COUNT(*) FILTER (WHERE payment_status = 'cancelled')
    INTO
        analytics_result.total_revenue,
        analytics_result.total_orders,
        analytics_result.pending_orders,
        analytics_result.completed_orders,
        analytics_result.failed_orders,
        analytics_result.refunded_orders,
        analytics_result.cancelled_orders
    FROM
        public.orders;

    RETURN analytics_result;
END;
$$;
COMMENT ON FUNCTION public.get_order_analytics() IS 'Returns key analytics about orders, such as revenue and counts by status. For admin use only.';
