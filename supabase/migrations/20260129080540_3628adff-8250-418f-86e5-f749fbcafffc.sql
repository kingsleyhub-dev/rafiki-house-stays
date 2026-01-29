-- Create table for service category images
CREATE TABLE public.service_category_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL UNIQUE CHECK (category IN ('breakfast', 'lunch', 'dinner', 'drinks', 'game_drive')),
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_category_images ENABLE ROW LEVEL SECURITY;

-- Public can view
CREATE POLICY "Service category images are viewable by everyone"
ON public.service_category_images FOR SELECT
USING (true);

-- Admins can manage
CREATE POLICY "Admins can insert service category images"
ON public.service_category_images FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update service category images"
ON public.service_category_images FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service category images"
ON public.service_category_images FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_service_category_images_updated_at
BEFORE UPDATE ON public.service_category_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial rows for each category (no images yet)
INSERT INTO public.service_category_images (category) VALUES
  ('breakfast'),
  ('lunch'),
  ('dinner'),
  ('drinks'),
  ('game_drive');

-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

-- Storage policies for service images
CREATE POLICY "Service images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update service images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service images"
ON storage.objects FOR DELETE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));