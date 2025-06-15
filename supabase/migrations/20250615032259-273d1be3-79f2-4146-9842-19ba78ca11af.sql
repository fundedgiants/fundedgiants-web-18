
-- Drop the trigger and function that automatically create an affiliate for new users
DROP TRIGGER IF EXISTS on_auth_user_created_create_affiliate ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_create_affiliate();

-- Add columns to the affiliates table to support an application process
ALTER TABLE public.affiliates
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN social_media_urls JSONB,
ADD COLUMN promotion_methods TEXT;

-- Drop the old RLS policy for viewing affiliate data
DROP POLICY IF EXISTS "Affiliates can view their own data" ON public.affiliates;

-- Create a new policy that allows users to see their own affiliate record (regardless of status)
CREATE POLICY "Users can view their own affiliate data"
ON public.affiliates
FOR SELECT
USING (auth.uid() = user_id);

-- Create a policy allowing authenticated users to submit an affiliate application (insert a row)
CREATE POLICY "Users can create their own affiliate application"
ON public.affiliates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create a policy allowing approved affiliates to update their details (like their code)
CREATE POLICY "Approved affiliates can update their own data"
ON public.affiliates
FOR UPDATE
USING (auth.uid() = user_id AND status = 'approved');

