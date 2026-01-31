-- Create safari_destinations table
CREATE TABLE public.safari_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  experience TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create safari_experience_images table for admin-uploaded gallery images
CREATE TABLE public.safari_experience_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  destination_id UUID REFERENCES public.safari_destinations(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.safari_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safari_experience_images ENABLE ROW LEVEL SECURITY;

-- Safari destinations policies
CREATE POLICY "Safari destinations are viewable by everyone"
  ON public.safari_destinations FOR SELECT USING (true);

CREATE POLICY "Admins can insert safari destinations"
  ON public.safari_destinations FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update safari destinations"
  ON public.safari_destinations FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete safari destinations"
  ON public.safari_destinations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Safari experience images policies
CREATE POLICY "Safari experience images are viewable by everyone"
  ON public.safari_experience_images FOR SELECT USING (true);

CREATE POLICY "Admins can insert safari experience images"
  ON public.safari_experience_images FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update safari experience images"
  ON public.safari_experience_images FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete safari experience images"
  ON public.safari_experience_images FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for safari images
INSERT INTO storage.buckets (id, name, public) VALUES ('safari-images', 'safari-images', true);

-- Storage policies for safari images
CREATE POLICY "Safari images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'safari-images');

CREATE POLICY "Admins can upload safari images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'safari-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update safari images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'safari-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete safari images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'safari-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Seed initial destinations data
INSERT INTO public.safari_destinations (slug, name, tagline, description, experience, sort_order) VALUES
('ol-pejeta', 'Ol Pejeta Conservancy', 'A Beacon of Rhino Conservation', 'Ol Pejeta is more than just a park; it is a world-class sanctuary famous for its groundbreaking work with the Southern White Rhino and its status as the home of the world''s last two remaining Northern White Rhinos.', 'Beyond rhino tracking, you can visit the Sweetwaters Chimpanzee Sanctuary or enjoy a night game drive to spot the "Big Five."', 1),
('ngare-ndare', 'Ngare Ndare Forest', 'Canopy Walks & Azure Waters', 'Tucked at the foothills of Mt. Kenya, this indigenous forest is a hidden gem. It boasts a 450-meter-long aerial canopy walk—the longest in Africa—suspended 10 meters above the ground, offering a bird''s-eye view of elephants and monkeys below.', 'After the walk, hike through the lush greenery to the famous Blue Pools, where you can take a glacial swim in crystal-clear turquoise waters fed by forest waterfalls.', 2),
('mt-ololokwe', 'Mt. Ololokwe', 'The Sacred Altar of the North', 'Rising majestically from the Samburu plains, Mt. Ololokwe is a flat-topped mountain offering one of Kenya''s most rewarding treks. It is a place of deep spiritual significance to the local Samburu people.', 'Known for its dramatic "cathedral-like" cliffs, a hike here provides unparalleled panoramic views where you can witness both the golden sunrise and the fiery sunset over the northern frontier.', 3),
('mt-kenya', 'Mt. Kenya National Park', 'Touching the Sky', 'As Africa''s second-highest peak and a UNESCO World Heritage site, Mt. Kenya offers a diverse ecosystem ranging from bamboo forests to alpine moorlands and glaciers.', 'Whether you are an expert climber aiming for the peaks of Batian and Nelion or a casual hiker seeking the scenic Point Lenana, the park''s glacial tarns and rare mountain flora are unforgettable.', 4),
('ol-jogi', 'Ol Jogi Conservancy', 'A Unique Wildlife Haven', 'Ol Jogi is one of Kenya''s most exclusive private conservancies. It is famously the only place in Africa where you can find a bear (specifically a rescued polar bear at their world-class Wildlife Rescue Center).', 'Visit their animal orphanage to see "Bubu" the elephant and the "dancing parrots," or explore the "Grand Canyons" of Laikipia, a stunning ochre-colored geological formation.', 5),
('mau-mau-caves', 'Mau Mau Caves', 'A Journey Through History', 'Hidden deep within the Burguret River forest on the slopes of Mt. Kenya, these caves served as strategic hideouts and supply depots for the Mau Mau freedom fighters during Kenya''s struggle for independence.', 'A gentle hike through the forest brings you to these historic caves, often accompanied by the sound of a nearby waterfall, blending historical education with natural beauty.', 6),
('samburu', 'Samburu National Reserve', 'The Rugged North', 'Bordered by the life-giving Ewaso Nyiro River, Samburu is home to the "Special Five"—wildlife species found only north of the equator: the Grevy''s zebra, Somali ostrich, reticulated giraffe, gerenuk, and Beisa oryx.', 'The reserve is famous for its dense elephant population and high leopard sightings, all set against a backdrop of iconic red-dirt landscapes.', 7),
('aberdare', 'Aberdare National Park', 'The Land of Waterfalls', 'Characterized by deep ravines, misty moorlands, and towering waterfalls (like the 273m Karuru Falls), the Aberdares offers a cool, mountainous escape from the savannah.', 'It is a prime location for trout fishing and spotting rare species like the Black Panther or the elusive Mountain Bongo antelope.', 8),
('mt-kenya-orphanage', 'Mt. Kenya Animal Orphanage', 'A Second Chance for Wildlife', 'Located within the Mount Kenya Wildlife Conservancy, this facility provides a sanctuary for orphaned, injured, or distressed wild animals with the goal of rehabilitating them for release.', 'Get up close with cheetahs, llamas, and the rare Mountain Bongo while learning about the intensive conservation efforts required to protect Kenya''s biodiversity.', 9);

-- Create updated_at trigger for safari_destinations
CREATE TRIGGER update_safari_destinations_updated_at
  BEFORE UPDATE ON public.safari_destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for safari_experience_images
CREATE TRIGGER update_safari_experience_images_updated_at
  BEFORE UPDATE ON public.safari_experience_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();