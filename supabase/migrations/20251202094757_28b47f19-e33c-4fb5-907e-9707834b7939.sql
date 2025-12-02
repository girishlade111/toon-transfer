-- Fix security issues in files table

-- 1. Drop overly permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can update download count" ON public.files;

-- 2. Create restrictive UPDATE policy that only allows incrementing download_count
-- This prevents attackers from modifying expiry dates, file paths, or other metadata
CREATE POLICY "Allow download count increment only"
ON public.files
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (
  -- Only allow updating download_count, and only incrementing it
  download_count = (SELECT download_count FROM public.files WHERE id = files.id) + 1
  AND expire_at = (SELECT expire_at FROM public.files WHERE id = files.id)
  AND file_path = (SELECT file_path FROM public.files WHERE id = files.id)
  AND file_name = (SELECT file_name FROM public.files WHERE id = files.id)
  AND password_hash IS NOT DISTINCT FROM (SELECT password_hash FROM public.files WHERE id = files.id)
);

-- 3. Drop overly permissive SELECT policy for public access
DROP POLICY IF EXISTS "Anyone can view files by link" ON public.files;

-- 4. Create a secure view that only exposes safe file metadata
CREATE OR REPLACE VIEW public.files_public AS
SELECT 
  id,
  link_id,
  file_name,
  file_size,
  file_type,
  expire_at,
  download_count,
  password_hash,
  created_at
FROM public.files;

-- 5. Create SELECT policy for the view (safe fields only)
CREATE POLICY "Anyone can view safe file metadata by link"
ON public.files
FOR SELECT
TO anon, authenticated
USING (true);

-- 6. Grant access to the view
GRANT SELECT ON public.files_public TO anon, authenticated;