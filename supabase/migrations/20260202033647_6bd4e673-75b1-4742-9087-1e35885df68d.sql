-- Create about_content table to store editable About page sections
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Public can view about content
CREATE POLICY "About content is viewable by everyone"
ON public.about_content
FOR SELECT
USING (true);

-- Admins can manage about content
CREATE POLICY "Admins can insert about content"
ON public.about_content
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update about content"
ON public.about_content
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete about content"
ON public.about_content
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.about_content (section_key, title, content) VALUES
('origin_story', 'Where We Came From', 'In 2018, the foundation of Rafiki House Nanyuki wasn''t laid with stone, but with the wheels of a bicycle. Our proprietor spent his days cycling across Nanyuki, selling snacks and connecting with the community.

Today, that bicycle stands as a tribute to our humble beginnings. We invite you to book a stay, relax by the fire, and hear the rest of the story directly from our proprietor during our evening bonfire sessions.'),

('main_story', 'A Dream Born in the Highlands', 'Nestled at the foot of Mount Kenya, Rafiki House Nanyuki began as a dream to create a sanctuary where travelers could experience the authentic beauty of the Kenyan highlands. The name "Rafiki" means "friend" in Swahili — and that''s exactly what we aim to be to every guest who walks through our doors.

"You dream it, we''ll drive it. Let''s uncover the hidden gems of this beautiful country together."

Our eight unique homes are each named after aromatic herbs and spices, reflecting the rich botanical diversity of our property and the culinary traditions of Kenya. From the vibrant Paprika to the serene Sage, each space tells its own story.

We work closely with local craftspeople, farmers, and guides to ensure that every stay contributes positively to our community. Our gardens supply fresh produce to local markets, our buildings showcase traditional building techniques, and our team is drawn entirely from the surrounding villages.

Whether you''re here to summit Mount Kenya, spot wildlife on safari, or simply disconnect from the world, Rafiki House Nanyuki offers a home away from home in one of Africa''s most spectacular settings. Your next great adventure starts here.'),

('value_hospitality', 'Hospitality', 'We believe in the power of genuine human connection and warm Kenyan welcome.'),

('value_sustainability', 'Sustainability', 'Each home is designed with eco-friendly practices and local materials.'),

('value_community', 'Community', 'We support local artisans, farmers, and businesses in Nanyuki.'),

('value_adventure', 'Adventure', 'From Mount Kenya hikes to wildlife safaris, adventure awaits at every turn.'),

('location_info', 'Discover Nanyuki', 'Nanyuki is a charming town in Laikipia County, known as the gateway to Mount Kenya. With its year-round temperate climate and stunning landscapes, it''s the perfect base for adventure.

• Just 200km north of Nairobi (2-3 hours drive)
• Home to world-class wildlife conservancies
• Gateway to Mount Kenya National Park
• Rich equestrian and farming heritage');