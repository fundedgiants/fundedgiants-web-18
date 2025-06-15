
-- Create an ENUM type for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create a table to assign roles to users
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);
COMMENT ON TABLE public.user_roles IS 'Assigns roles to users.';

-- Create a function to check if a user has a specific role. This will be used for security policies.
CREATE OR REPLACE FUNCTION public.has_role(user_id_to_check uuid, role_to_check app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = user_id_to_check AND role = role_to_check
  );
END;
$$;
COMMENT ON FUNCTION public.has_role(uuid, app_role) IS 'Checks if a user has a specific role. To be used in RLS policies.';

-- Enable Row-Level Security on the new table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins get full access to manage all user roles.
CREATE POLICY "Allow admin full access to user roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policy: Users can see their own roles.
CREATE POLICY "Allow user to view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create a function that can be called from the app to check if the current user is an admin.
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;
COMMENT ON FUNCTION public.is_current_user_admin() IS 'Check if the currently authenticated user is an admin. For use in the application via RPC.';
