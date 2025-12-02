-- Add user_id to files table (nullable to support anonymous uploads)
ALTER TABLE public.files ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to support both authenticated and anonymous users
DROP POLICY IF EXISTS "Anyone can upload files" ON public.files;
DROP POLICY IF EXISTS "Anyone can view files by link" ON public.files;
DROP POLICY IF EXISTS "Anyone can update download count" ON public.files;

-- Allow anyone (authenticated or anonymous) to insert files
CREATE POLICY "Anyone can upload files"
ON public.files
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view files by link (for download page)
CREATE POLICY "Anyone can view files by link"
ON public.files
FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users can view only their own files in dashboard
CREATE POLICY "Users can view their own files"
ON public.files
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow anyone to update download count
CREATE POLICY "Anyone can update download count"
ON public.files
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON public.files
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);