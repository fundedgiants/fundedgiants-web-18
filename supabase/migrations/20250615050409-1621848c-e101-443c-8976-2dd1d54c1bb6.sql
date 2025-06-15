
-- Add a 'tier' column to the affiliates table to track their current level.
-- 'bronze' is Tier 1, and is the default for all new affiliates.
ALTER TABLE public.affiliates
ADD COLUMN tier TEXT NOT NULL DEFAULT 'bronze';

-- Change the default commission rate for new affiliates to 5% to match Tier 1.
ALTER TABLE public.affiliates
ALTER COLUMN commission_rate SET DEFAULT 0.05;

-- Update all existing affiliates to be on Tier 1 ('bronze') with a 5% commission rate.
-- This ensures consistency for users who joined before the tier system was introduced.
UPDATE public.affiliates
SET
  tier = 'bronze',
  commission_rate = 0.05;

-- This function automatically upgrades (or downgrades) an affiliate's tier based on their total sales volume.
CREATE OR REPLACE FUNCTION public.update_affiliate_tier_on_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  total_sales_volume NUMERIC;
  current_tier TEXT;
  new_tier TEXT;
  new_commission_rate NUMERIC(4, 2);
  affiliate_id_to_update UUID;
BEGIN
  -- Determine which affiliate_id to use based on the operation
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    affiliate_id_to_update := NEW.affiliate_id;
  ELSE
    -- On DELETE, we recalculate based on the old data
    affiliate_id_to_update := OLD.affiliate_id;
  END IF;

  -- Only proceed if the operation could affect earnings (a referral changing to/from 'completed')
  IF (TG_OP = 'INSERT' AND NEW.status = 'completed') OR
     (TG_OP = 'UPDATE' AND NEW.status != OLD.status AND (NEW.status = 'completed' OR OLD.status = 'completed')) OR
     (TG_OP = 'DELETE' AND OLD.status = 'completed') THEN

    -- Calculate total sales volume from all completed referrals for this affiliate
    SELECT COALESCE(SUM(o.total_price), 0)
    INTO total_sales_volume
    FROM public.orders o
    JOIN public.affiliate_referrals ar ON o.id = ar.order_id
    WHERE ar.affiliate_id = affiliate_id_to_update AND ar.status = 'completed';

    -- Determine the new tier based on sales volume thresholds
    IF total_sales_volume > 10000 THEN
      new_tier := 'gold';
      new_commission_rate := 0.10;
    ELSIF total_sales_volume > 5000 THEN
      new_tier := 'silver';
      new_commission_rate := 0.075;
    ELSE
      new_tier := 'bronze';
      new_commission_rate := 0.05;
    END IF;

    -- Get the affiliate's current tier
    SELECT tier INTO current_tier FROM public.affiliates WHERE id = affiliate_id_to_update;

    -- If the calculated tier is different from the current one, update the affiliate's record.
    IF new_tier IS DISTINCT FROM current_tier THEN
      UPDATE public.affiliates
      SET
        tier = new_tier,
        commission_rate = new_commission_rate
      WHERE id = affiliate_id_to_update;
    END IF;
  END IF;

  -- Return the appropriate row for the trigger
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create a trigger that executes the function whenever a referral is created, updated, or deleted.
-- This ensures tiers are always accurate, even if a completed referral is modified or removed.
CREATE TRIGGER on_referral_change_update_tier
  AFTER INSERT OR UPDATE OR DELETE ON public.affiliate_referrals
  FOR EACH ROW EXECUTE PROCEDURE public.update_affiliate_tier_on_referral();
