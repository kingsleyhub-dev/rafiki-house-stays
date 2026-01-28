-- Create services table for managing menu items and game drives
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'drinks', 'game_drive')),
  name text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  duration text,
  time_slot text,
  includes text[],
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can read active services
CREATE POLICY "Services are viewable by everyone"
ON public.services
FOR SELECT
USING (true);

-- Admins can insert services
CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update services
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete services
CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data from the current static content
INSERT INTO public.services (category, name, description, price, sort_order) VALUES
-- Breakfast
('breakfast', 'Full English Breakfast', 'Eggs, bacon, sausages, beans, toast & grilled tomatoes', 'KES 1,200', 1),
('breakfast', 'Kenyan Breakfast', 'Mandazi, chai, fresh fruits & scrambled eggs', 'KES 900', 2),
('breakfast', 'Continental Breakfast', 'Pastries, cold cuts, cheese, fresh juice & coffee', 'KES 1,000', 3),
('breakfast', 'Pancake Stack', 'Fluffy pancakes with maple syrup, berries & whipped cream', 'KES 850', 4),
('breakfast', 'Eggs Benedict', 'Poached eggs, hollandaise sauce on toasted muffins', 'KES 1,100', 5),
('breakfast', 'Fresh Fruit Platter', 'Seasonal Kenyan fruits with yogurt & honey', 'KES 650', 6),
-- Lunch
('lunch', 'Grilled Tilapia', 'Fresh Lake Naivasha tilapia with ugali & sukuma wiki', 'KES 1,800', 1),
('lunch', 'Nyama Choma Platter', 'Grilled goat meat with kachumbari & roasted potatoes', 'KES 2,200', 2),
('lunch', 'Chicken Stir-Fry', 'Tender chicken with vegetables & jasmine rice', 'KES 1,500', 3),
('lunch', 'Garden Salad Bowl', 'Fresh greens, avocado, tomatoes & grilled halloumi', 'KES 1,100', 4),
('lunch', 'Beef Burger', 'Homemade patty with cheese, lettuce & crispy fries', 'KES 1,400', 5),
('lunch', 'Pasta Primavera', 'Fresh pasta with seasonal vegetables in herb sauce', 'KES 1,300', 6),
-- Dinner
('dinner', 'Grilled Lamb Chops', 'Herb-crusted lamb with rosemary jus & vegetables', 'KES 3,200', 1),
('dinner', 'Beef Tenderloin', 'Prime beef with red wine reduction & mashed potatoes', 'KES 3,500', 2),
('dinner', 'Swahili Coconut Fish', 'Fresh catch in coconut curry with pilau rice', 'KES 2,400', 3),
('dinner', 'Roasted Chicken', 'Free-range chicken with herbs & roasted vegetables', 'KES 2,000', 4),
('dinner', 'Vegetarian Feast', 'Grilled vegetables, lentil curry & chapati', 'KES 1,600', 5),
('dinner', 'Seafood Platter', 'Prawns, calamari & fish with garlic butter sauce', 'KES 4,000', 6),
-- Drinks
('drinks', 'Fresh Passion Juice', 'Freshly squeezed Kenyan passion fruit', 'KES 350', 1),
('drinks', 'Mango Smoothie', 'Creamy mango blend with a hint of ginger', 'KES 400', 2),
('drinks', 'Dawa Cocktail', 'Kenyan honey, lime & vodka signature drink', 'KES 650', 3),
('drinks', 'Tusker Beer', 'Kenya''s finest lager, ice cold', 'KES 350', 4),
('drinks', 'House Wine', 'Selected red or white by the glass', 'KES 700', 5),
('drinks', 'Kenyan Coffee', 'Freshly roasted Arabica from Mt. Kenya', 'KES 250', 6),
('drinks', 'Chai Masala', 'Traditional spiced Kenyan tea', 'KES 200', 7),
('drinks', 'Fresh Coconut Water', 'Straight from the shell', 'KES 300', 8);

-- Insert game drives
INSERT INTO public.services (category, name, description, price, duration, time_slot, includes, sort_order) VALUES
('game_drive', 'Morning Game Drive', 'Experience the African bush at dawn when wildlife is most active. Spot lions, elephants, buffalo, and countless bird species.', 'KES 8,500 per person', '3-4 hours', '6:00 AM - 10:00 AM', ARRAY['Professional guide', 'Bottled water', 'Binoculars', 'Bush breakfast'], 1),
('game_drive', 'Afternoon Game Drive', 'Enjoy the golden afternoon light as animals gather at watering holes. Perfect for photography enthusiasts.', 'KES 8,500 per person', '3-4 hours', '3:00 PM - 7:00 PM', ARRAY['Professional guide', 'Sundowner drinks', 'Snacks', 'Blankets'], 2),
('game_drive', 'Full Day Safari', 'The ultimate wildlife experience. Explore multiple ecosystems and maximize your chances of seeing the Big Five.', 'KES 18,000 per person', '8-10 hours', '6:00 AM - 4:00 PM', ARRAY['Professional guide', 'Bush breakfast', 'Picnic lunch', 'All refreshments', 'Park fees'], 3);