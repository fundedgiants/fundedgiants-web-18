
CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Check if the calling user has the 'admin' role.
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Permission denied: must be an admin to call this function.';
  END IF;

  -- If the user is an admin, count all users.
  SELECT count(*) INTO user_count FROM auth.users;
  RETURN user_count;
END;
$$;

COMMENT ON FUNCTION public.get_total_users_count() IS 'Returns the total number of users. Can only be called by an admin.';
