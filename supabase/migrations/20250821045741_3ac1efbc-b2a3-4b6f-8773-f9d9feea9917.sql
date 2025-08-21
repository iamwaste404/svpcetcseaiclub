-- Create all tables and their policies from scratch

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  roll_number TEXT,
  email TEXT NOT NULL,
  skills TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create clubs table
CREATE TABLE public.clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for clubs (public read access)
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clubs" 
ON public.clubs 
FOR SELECT 
USING (true);

-- Create user_clubs table for memberships
CREATE TABLE public.user_clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, club_id)
);

-- Enable RLS for user_clubs
ALTER TABLE public.user_clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own club memberships" 
ON public.user_clubs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can join clubs" 
ON public.user_clubs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave clubs" 
ON public.user_clubs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS for event_registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own event registrations" 
ON public.event_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements" 
ON public.announcements 
FOR SELECT 
USING (true);

-- Insert initial clubs data
INSERT INTO public.clubs (name, description, member_count) VALUES
('Technology, Coding & Skill Development Club', 'Dive into the world of programming, web development, AI, and emerging technologies. Build projects, participate in hackathons, and enhance your technical skills.', 150),
('General Club', 'A versatile community for students with diverse interests. Engage in various activities, discussions, and collaborative projects across different domains.', 200),
('Eco-Swachh Bharat Club', 'Promote environmental awareness and sustainability. Participate in tree plantation drives, cleanliness campaigns, and eco-friendly initiatives.', 120),
('Yoga, Gaming & Sports Club', 'Balance mind and body through yoga sessions, gaming tournaments, and sports activities. Foster wellness and healthy competition.', 180),
('Business Management Club', 'Develop entrepreneurial skills, learn about business strategies, and participate in case study competitions and startup pitches.', 110),
('Arts & Cultural Club', 'Express creativity through dance, music, drama, and fine arts. Organize cultural events and celebrate diverse traditions.', 160),
('Photography, Short Film & Videography Club', 'Capture moments and tell stories through the lens. Learn photography techniques, film-making, and video editing skills.', 95),
('Organization Club', 'Master event management, leadership, and organizational skills. Plan and execute college events and activities.', 85);

-- Insert some sample events
INSERT INTO public.events (title, description, club_id, event_date, registration_deadline, max_participants) VALUES
('AI & Machine Learning Workshop', 'Learn the fundamentals of AI and ML with hands-on coding sessions.', (SELECT id FROM public.clubs WHERE name = 'Technology, Coding & Skill Development Club'), '2025-09-15 10:00:00+00', '2025-09-10 23:59:59+00', 50),
('Annual Photography Contest', 'Showcase your photography skills in our annual contest with exciting prizes.', (SELECT id FROM public.clubs WHERE name = 'Photography, Short Film & Videography Club'), '2025-09-20 09:00:00+00', '2025-09-18 23:59:59+00', 100),
('Startup Pitch Competition', 'Present your business ideas to industry experts and win funding opportunities.', (SELECT id FROM public.clubs WHERE name = 'Business Management Club'), '2025-09-25 14:00:00+00', '2025-09-20 23:59:59+00', 30),
('Cultural Festival 2025', 'Join us for a celebration of diverse cultures with music, dance, and art.', (SELECT id FROM public.clubs WHERE name = 'Arts & Cultural Club'), '2025-10-01 16:00:00+00', '2025-09-28 23:59:59+00', 200);

-- Insert some sample announcements
INSERT INTO public.announcements (title, content, club_id) VALUES
('Welcome to Tech Club!', 'We are excited to welcome all new members to our technology club. Get ready for an amazing journey of learning and innovation.', (SELECT id FROM public.clubs WHERE name = 'Technology, Coding & Skill Development Club')),
('Photography Workshop Next Week', 'Join us for an intensive photography workshop covering basic to advanced techniques. Cameras will be provided.', (SELECT id FROM public.clubs WHERE name = 'Photography, Short Film & Videography Club')),
('Business Plan Competition', 'Submit your business plans for our upcoming competition. Winners will receive mentorship and funding opportunities.', (SELECT id FROM public.clubs WHERE name = 'Business Management Club'));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();