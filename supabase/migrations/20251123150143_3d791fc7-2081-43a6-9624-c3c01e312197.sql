-- Fix function search path security issue
CREATE OR REPLACE FUNCTION delete_expired_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.files
  WHERE expire_at < now();
END;
$$;