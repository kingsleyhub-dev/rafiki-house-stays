-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  nightly_price INTEGER NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  beds INTEGER NOT NULL DEFAULT 1,
  baths INTEGER NOT NULL DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  home_type TEXT NOT NULL DEFAULT 'Cottage',
  city TEXT NOT NULL DEFAULT 'Nanyuki',
  country TEXT NOT NULL DEFAULT 'Kenya',
  rating NUMERIC(2,1),
  review_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  nightly_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Properties policies (public read, admin write)
CREATE POLICY "Properties are viewable by everyone"
ON public.properties FOR SELECT
USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial properties data
INSERT INTO public.properties (slug, name, title, description, nightly_price, max_guests, beds, baths, amenities, image_urls, home_type, rating, review_count) VALUES
('amaranth', 'Amaranth', 'Amaranth - Cozy Mountain Retreat', 'A charming cottage nestled in the foothills of Mount Kenya, offering stunning views and a peaceful escape from city life. Perfect for couples or solo travelers seeking tranquility.', 18500, 2, 1, 1, ARRAY['Wi-Fi', 'Kitchen', 'Fireplace', 'Mountain View', 'Garden Access'], ARRAY['/placeholder.svg'], 'Cottage', 4.9, 28),
('citronella', 'Citronella', 'Citronella - Garden Paradise', 'Surrounded by fragrant gardens and native plants, this beautiful home offers a unique connection to nature with modern comforts.', 22000, 4, 2, 2, ARRAY['Wi-Fi', 'Kitchen', 'Parking', 'Garden', 'BBQ Area'], ARRAY['/placeholder.svg'], 'Garden House', 4.8, 42),
('paprika', 'Paprika', 'Paprika - Family Homestead', 'A spacious family home with warm interiors and plenty of room for everyone. Features a large living area and fully equipped kitchen.', 28000, 6, 3, 2, ARRAY['Wi-Fi', 'Kitchen', 'Parking', 'Fireplace', 'Game Room'], ARRAY['/placeholder.svg'], 'Family Home', 4.7, 35),
('rosmarino', 'Rosmarino', 'Rosmarino - Luxury Villa', 'Experience luxury living in this elegant villa with premium finishes, expansive outdoor spaces, and breathtaking panoramic views.', 45000, 8, 4, 3, ARRAY['Wi-Fi', 'Kitchen', 'Pool', 'Parking', 'Home Theater', 'Wine Cellar'], ARRAY['/placeholder.svg'], 'Villa', 5.0, 19),
('oregano', 'Oregano', 'Oregano - Artist''s Loft', 'A creative space filled with natural light and artistic touches. Perfect for those seeking inspiration in a unique setting.', 20000, 3, 2, 1, ARRAY['Wi-Fi', 'Kitchen', 'Art Studio', 'Balcony'], ARRAY['/placeholder.svg'], 'Loft', 4.6, 23),
('sage', 'Sage', 'Sage - Wellness Sanctuary', 'Designed for relaxation and rejuvenation, featuring a private spa area and meditation garden.', 32000, 4, 2, 2, ARRAY['Wi-Fi', 'Kitchen', 'Spa', 'Yoga Deck', 'Massage Room'], ARRAY['/placeholder.svg'], 'Wellness Retreat', 4.9, 31),
('ginger', 'Ginger', 'Ginger - Safari Lodge', 'Experience authentic African safari living with modern amenities. Watch wildlife from your private viewing deck.', 38000, 6, 3, 2, ARRAY['Wi-Fi', 'Kitchen', 'Viewing Deck', 'Fire Pit', 'Safari Guide'], ARRAY['/placeholder.svg'], 'Safari Lodge', 4.8, 47),
('thyme', 'Thyme', 'Thyme - Romantic Hideaway', 'An intimate retreat perfect for couples, featuring a private terrace with sunset views and romantic ambiance.', 25000, 2, 1, 1, ARRAY['Wi-Fi', 'Kitchen', 'Hot Tub', 'Private Terrace', 'Breakfast Included'], ARRAY['/placeholder.svg'], 'Romantic Suite', 5.0, 56);