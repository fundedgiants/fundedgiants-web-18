
-- Add a column to store personal information for affiliate applicants
ALTER TABLE public.affiliates
ADD COLUMN personal_info jsonb;
