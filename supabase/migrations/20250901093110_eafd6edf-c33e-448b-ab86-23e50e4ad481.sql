-- Add additional fields to profiles table for enhanced registration
ALTER TABLE public.profiles 
ADD COLUMN phone_number text,
ADD COLUMN branch text,
ADD COLUMN year text,
ADD COLUMN selected_club_id uuid REFERENCES public.clubs(id);

-- Create branches table for dropdown options
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert common engineering branches
INSERT INTO public.branches (name, code) VALUES
('Computer Science and Engineering - Artificial Intelligence', 'CSE-AI'),
('Computer Science and Engineering', 'CSE'),
('Electronics and Communication Engineering', 'ECE'),
('Electrical and Electronics Engineering', 'EEE'),
('Mechanical Engineering', 'ME'),
('Civil Engineering', 'CE'),
('Information Technology', 'IT'),
('Biotechnology', 'BT');

-- Create years table for dropdown options  
CREATE TABLE public.years (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year_name text NOT NULL,
  year_value text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert academic years
INSERT INTO public.years (year_name, year_value) VALUES
('First Year', '1'),
('Second Year', '2'), 
('Third Year', '3'),
('Fourth Year', '4');

-- Enable RLS on new tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.years ENABLE ROW LEVEL SECURITY;

-- Create policies for branches and years (public read access)
CREATE POLICY "Anyone can view branches" 
ON public.branches 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view years" 
ON public.years 
FOR SELECT 
USING (true);