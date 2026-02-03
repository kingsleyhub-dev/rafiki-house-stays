-- Create amenities table
CREATE TABLE public.amenities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Amenities are viewable by everyone" 
ON public.amenities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert amenities" 
ON public.amenities 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update amenities" 
ON public.amenities 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete amenities" 
ON public.amenities 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_amenities_updated_at
BEFORE UPDATE ON public.amenities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing amenities from properties
INSERT INTO public.amenities (name, sort_order) VALUES
('Wi-Fi', 1),
('Kitchen', 2),
('Parking', 3),
('Fireplace', 4),
('Mountain View', 5),
('Garden', 6),
('Garden Access', 7),
('Balcony', 8),
('Private Terrace', 9),
('Viewing Deck', 10),
('Pool', 11),
('Hot Tub', 12),
('Spa', 13),
('BBQ Area', 14),
('Fire Pit', 15),
('Yoga Deck', 16),
('Game Room', 17),
('Home Theater', 18),
('Art Studio', 19),
('Wine Cellar', 20),
('Massage Room', 21),
('Safari Guide', 22),
('Breakfast Included', 23);