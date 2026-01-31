import { useState, useRef } from 'react';
import { useAdminSafariDestinations, useAdminSafariExperienceImages, useUploadSafariImage, useUploadMultipleSafariImages, useDeleteSafariExperienceImage, useUpdateDestinationImage } from '@/hooks/useSafaris';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Image as ImageIcon, MapPin, Camera } from 'lucide-react';

export function SafariExperienceImages() {
  const { data: destinations, isLoading: loadingDestinations } = useAdminSafariDestinations();
  const { data: experienceImages, isLoading: loadingImages } = useAdminSafariExperienceImages();
  const uploadMutation = useUploadSafariImage();
  const uploadMultipleMutation = useUploadMultipleSafariImages();
  const deleteMutation = useDeleteSafariExperienceImage();
  const updateDestinationImageMutation = useUpdateDestinationImage();
  
  const [uploadingExperience, setUploadingExperience] = useState(false);
  const [uploadingDestination, setUploadingDestination] = useState<string | null>(null);
  
  const experienceFileInputRef = useRef<HTMLInputElement>(null);
  const destinationFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const { toast } = useToast();

  const handleExperienceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingExperience(true);
    try {
      const fileArray = Array.from(files);
      await uploadMultipleMutation.mutateAsync(fileArray);
      toast({
        title: 'Success',
        description: `${fileArray.length} image${fileArray.length > 1 ? 's' : ''} uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingExperience(false);
      if (experienceFileInputRef.current) {
        experienceFileInputRef.current.value = '';
      }
    }
  };

  const handleDestinationImageUpload = async (destinationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDestination(destinationId);
    try {
      const imageUrl = await uploadMutation.mutateAsync({
        file,
        type: 'destination',
      });
      await updateDestinationImageMutation.mutateAsync({
        destinationId,
        imageUrl,
      });
      toast({
        title: 'Success',
        description: 'Destination image updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update destination image',
        variant: 'destructive',
      });
    } finally {
      setUploadingDestination(null);
    }
  };

  const handleDeleteExperienceImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteMutation.mutateAsync(imageId);
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  if (loadingDestinations || loadingImages) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Destination Images Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Destination Cover Images
          </CardTitle>
          <CardDescription>
            Update the main cover image for each safari destination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations?.map((destination) => (
              <div key={destination.id} className="border rounded-lg p-4 space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {destination.image_url ? (
                    <img
                      src={destination.image_url}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{destination.name}</h4>
                  <p className="text-xs text-muted-foreground">{destination.tagline}</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDestinationImageUpload(destination.id, e)}
                  ref={(el) => { destinationFileInputRefs.current[destination.id] = el; }}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={uploadingDestination === destination.id}
                  onClick={() => destinationFileInputRefs.current[destination.id]?.click()}
                >
                  {uploadingDestination === destination.id ? (
                    'Uploading...'
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {destination.image_url ? 'Change Image' : 'Add Image'}
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience Gallery Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Safari Experience Gallery
          </CardTitle>
          <CardDescription>
            Upload images from past safaris to showcase your experiences to visitors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleExperienceUpload}
              ref={experienceFileInputRef}
              className="hidden"
            />
            <Button
              onClick={() => experienceFileInputRef.current?.click()}
              disabled={uploadingExperience}
            >
              {uploadingExperience ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Experience Images
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Select multiple images at once to upload past safari experiences
            </p>
          </div>

          {/* Gallery Grid */}
          {experienceImages && experienceImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {experienceImages.map((image) => (
                <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title || 'Safari experience'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteExperienceImage(image.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {image.destination_id && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-xs bg-black/70 text-white px-2 py-1 rounded">
                        {destinations?.find(d => d.id === image.destination_id)?.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No experience images uploaded yet.</p>
              <p className="text-sm">Upload images to showcase your past safari adventures!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
