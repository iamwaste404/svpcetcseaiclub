-- Create storage bucket for event photos
INSERT INTO storage.buckets (id, name, public) VALUES ('event-photos', 'event-photos', true);

-- Create storage policies for event photos
CREATE POLICY "Anyone can view event photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-photos');

CREATE POLICY "Authenticated users can upload event photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

-- Add photo fields to events table
ALTER TABLE public.events 
ADD COLUMN photo_urls text[],
ADD COLUMN featured_image text;

-- Create admin roles table
CREATE TABLE public.admin_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Admin can view all admin roles
CREATE POLICY "Admins can view admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid()
));

-- Super admin can manage admin roles
CREATE POLICY "Admins can manage admin roles" 
ON public.admin_roles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid()
));

-- Update announcements table to allow admin management
DROP POLICY IF EXISTS "Anyone can view announcements" ON public.announcements;

CREATE POLICY "Anyone can view announcements" 
ON public.announcements 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage announcements" 
ON public.announcements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid()
));

-- Update events table to allow admin management
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid()
));

-- Update clubs table to allow admin management
DROP POLICY IF EXISTS "Anyone can view clubs" ON public.clubs;

CREATE POLICY "Anyone can view clubs" 
ON public.clubs 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage clubs" 
ON public.clubs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles ar 
  WHERE ar.user_id = auth.uid()
));

-- Insert default admin (you can change this email)
INSERT INTO public.admin_roles (user_id, role) 
SELECT id, 'super_admin' 
FROM auth.users 
WHERE email = 'admin@svpcet.edu' 
ON CONFLICT (user_id) DO NOTHING;