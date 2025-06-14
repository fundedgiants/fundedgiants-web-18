
-- Add billing address columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN phone TEXT NULL,
ADD COLUMN country TEXT NULL,
ADD COLUMN state TEXT NULL,
ADD COLUMN city TEXT NULL,
ADD COLUMN address TEXT NULL,
ADD COLUMN zip_code TEXT NULL;

-- Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add a policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Add a policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
