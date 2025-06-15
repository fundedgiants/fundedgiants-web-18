
-- This function creates a pending referral when a new order with an affiliate code is created.
CREATE OR REPLACE FUNCTION public.handle_new_order_create_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  affiliate_record RECORD;
  calculated_commission NUMERIC;
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
      -- Calculate commission based on the affiliate's current rate
      calculated_commission := NEW.total_price * affiliate_record.commission_rate;

      -- Insert a new record into affiliate_referrals with a 'pending' status
      INSERT INTO public.affiliate_referrals (affiliate_id, order_id, referred_user_id, commission_amount, status)
      VALUES (affiliate_record.id, NEW.id, NEW.user_id, calculated_commission, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- This trigger executes the function after a new order is inserted.
CREATE TRIGGER on_order_created_create_referral
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_order_create_referral();


-- This function updates the referral status when an order's payment status changes.
CREATE OR REPLACE FUNCTION public.handle_order_completion_update_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- If the order is paid, mark the referral as 'completed'
  IF OLD.payment_status IS DISTINCT FROM 'completed' AND NEW.payment_status = 'completed' THEN
    UPDATE public.affiliate_referrals
    SET status = 'completed'
    WHERE order_id = NEW.id;
  -- If the order is cancelled or refunded, mark the referral as 'cancelled'
  ELSIF NEW.payment_status IN ('cancelled', 'refunded') AND OLD.payment_status != NEW.payment_status THEN
     UPDATE public.affiliate_referrals
    SET status = 'cancelled'
    WHERE order_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- This trigger executes the function after an order's status is updated.
CREATE TRIGGER on_order_updated_update_referral_status
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_order_completion_update_referral();
