
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
    u.id as user_id,
    u.email,
    u.created_at,
    p.first_name,
    p.last_name,
    p.phone,
    p.country,
    public.has_role(u.id, 'admin') as is_admin
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_all_users_with_profiles() IS 'Returns a list of all users and their profile data, including admin status. For admin use only.';
