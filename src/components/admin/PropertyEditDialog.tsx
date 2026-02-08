import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Property } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { X, Loader2, ImagePlus } from 'lucide-react';

interface PropertyEditDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    id: string;
    name: string;
    title: string;
    description: string;
    nightly_price: number;
    max_guests: number;
    beds: number;
    baths: number;
    home_type: string;
    image_urls?: string[];
  }) => void;
  isLoading?: boolean;
}

export function PropertyEditDialog({
  property,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: PropertyEditDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    nightly_price: 0,
    max_guests: 2,
    beds: 1,
    baths: 1,
    home_type: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        title: property.title,
        description: property.description,
        nightly_price: property.nightlyPrice,
        max_guests: property.maxGuests,
        beds: property.beds,
        baths: property.baths,
        home_type: property.homeType,
      });
      // Filter out local asset URLs (they start with /)
      const dbImages = property.imageUrls.filter(url => url.startsWith('http'));
      setImageUrls(dbImages);
    }
  }, [property]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !property) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file',
            description: `${file.name} is not an image file.`,
            variant: 'destructive',
          });
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${property.slug}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload failed',
            description: uploadError.message,
            variant: 'destructive',
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        newUrls.push(publicUrl);
      }

      if (newUrls.length > 0) {
        setImageUrls(prev => [...prev, ...newUrls]);
        toast({
          title: 'Images uploaded',
          description: `${newUrls.length} image(s) uploaded successfully.`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading images.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (urlToRemove: string) => {
    // Extract the path from the URL
    try {
      const url = new URL(urlToRemove);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf('property-images');
      if (bucketIndex !== -1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        const { error } = await supabase.storage
          .from('property-images')
          .remove([filePath]);

        if (error) {
          console.error('Delete error:', error);
          // Still remove from UI even if storage delete fails
        }
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
    }

    setImageUrls(prev => prev.filter(url => url !== urlToRemove));
    toast({
      title: 'Image removed',
      description: 'The image has been removed.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      // Always include image_urls to sync with database (even empty array clears images)
      onSave({ 
        id: property.id, 
        ...formData,
        image_urls: imageUrls,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Management Section */}
          <div className="space-y-3">
            <Label>Property Images</Label>
            <p className="text-xs text-muted-foreground">
              The first image is used as the main/cover image. Upload images to replace the default.
            </p>
            
            {/* Current Images */}
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-border"
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Image</span>
                  </>
                )}
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {imageUrls.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Note: Local images are used as defaults. Upload new images to replace them.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="home_type">Property Type</Label>
              <Input
                id="home_type"
                value={formData.home_type}
                onChange={(e) => setFormData({ ...formData, home_type: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nightly_price">Price per Night (KES)</Label>
              <Input
                id="nightly_price"
                type="number"
                value={formData.nightly_price}
                onChange={(e) => setFormData({ ...formData, nightly_price: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_guests">Max Guests</Label>
              <Input
                id="max_guests"
                type="number"
                min={1}
                value={formData.max_guests}
                onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Beds</Label>
              <Input
                id="beds"
                type="number"
                min={1}
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baths">Baths</Label>
              <Input
                id="baths"
                type="number"
                min={1}
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
