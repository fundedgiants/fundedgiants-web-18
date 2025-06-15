
-- Drop the existing foreign key constraint that points to the internal auth users table
ALTER TABLE public.affiliate_referrals
DROP CONSTRAINT affiliate_referrals_referred_user_id_fkey;

-- Add a new foreign key constraint that points to the public profiles table
ALTER TABLE public.affiliate_referrals
ADD CONSTRAINT affiliate_referrals_referred_user_id_fkey
FOREIGN KEY (referred_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
