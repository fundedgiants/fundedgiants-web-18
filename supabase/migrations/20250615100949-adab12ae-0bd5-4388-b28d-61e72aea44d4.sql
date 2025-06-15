
-- First, let's update the function that fetches users to also check if they are an admin.
-- This will allow us to show their role status in the UI.
DROP FUNCTION IF EXISTS public.get_all_users_with_profiles();
CREATE OR REPLACE FUNCTION public.get_all_users_with_profiles()
RETURNS TABLE(
    user_id uuid,
    email text,
    created_at timestamptz,
    first_name text,
    last_name text,
    phone text,
    country text,
    is_admin boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First, check if the user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  -- If they are an admin, return the user data
  RETURN QUERY
  SELECT
    u.id,
    u.email,
    u.created_at,
    p.first_name,
    p.last_name,
    p.phone,
    p.country,
    public.has_role(u.id, 'admin')
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$$;
COMMENT ON FUNCTION public.get_all_users_with_profiles() IS 'Returns a list of all users and their profile data, including admin status. For admin use only.';

-- Now, let's create a function to grant the admin role to a user.
CREATE OR REPLACE FUNCTION public.grant_admin_role(target_user_id uuid)
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

    -- Insert the admin role for the target user, ignoring if it already exists.
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
COMMENT ON FUNCTION public.grant_admin_role(uuid) IS 'Grants the admin role to a specific user. Can only be called by an admin.';

-- Finally, a function to revoke the admin role.
CREATE OR REPLACE FUNCTION public.revoke_admin_role(target_user_id uuid)
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

    -- Prevent an admin from revoking their own role to avoid getting locked out.
    IF auth.uid() = target_user_id THEN
        RAISE EXCEPTION 'For security, admins cannot revoke their own admin role.';
    END IF;

    -- Delete the admin role for the target user.
    DELETE FROM user_roles
    WHERE user_id = target_user_id AND role = 'admin';
END;
$$;
COMMENT ON FUNCTION public.revoke_admin_role(uuid) IS 'Revokes the admin role from a specific user. Can only be called by an admin.';
