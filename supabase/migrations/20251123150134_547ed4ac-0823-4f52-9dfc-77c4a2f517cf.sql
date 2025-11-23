-- Create files table for tracking uploads
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  password_hash TEXT,
  expire_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent TEXT,
  download_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert files (public file sharing)
CREATE POLICY "Anyone can upload files"
ON public.files
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to read files by link_id (for download page)
CREATE POLICY "Anyone can view files by link"
ON public.files
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow update for download count
CREATE POLICY "Anyone can update download count"
ON public.files
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('transfers', 'transfers', false);

-- Storage policies for file uploads
CREATE POLICY "Anyone can upload files to transfers bucket"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'transfers');

-- Storage policies for file downloads (will check password in edge function)
CREATE POLICY "Anyone can download files from transfers bucket"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'transfers');

-- Create function to automatically delete expired files
CREATE OR REPLACE FUNCTION delete_expired_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.files
  WHERE expire_at < now();
END;
$$;