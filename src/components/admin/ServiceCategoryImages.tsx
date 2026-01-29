import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useServiceCategoryImages,
  useUploadServiceCategoryImage,
  useDeleteServiceCategoryImage,
  ServiceCategory,
} from '@/hooks/useServiceCategoryImages';
import { toast } from '@/hooks/use-toast';

const categoryLabels: Record<ServiceCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  drinks: 'Drinks',
  game_drive: 'Game Drive',
};

const categoryDescriptions: Record<ServiceCategory, string> = {
  breakfast: 'Morning meals section hero image',
  lunch: 'Midday meals section hero image',
  dinner: 'Evening dining section hero image',
  drinks: 'Bar & beverages section hero image',
  game_drive: 'Safari adventures section hero image',
};

export function ServiceCategoryImages() {
  const { data: categoryImages = [], isLoading } = useServiceCategoryImages();
  const uploadImage = useUploadServiceCategoryImage();
  const deleteImage = useDeleteServiceCategoryImage();
  
  const [uploadingCategory, setUploadingCategory] = useState<ServiceCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ category: ServiceCategory; imageUrl: string } | null>(null);
  const fileInputRefs = useRef<Record<ServiceCategory, HTMLInputElement | null>>({} as Record<ServiceCategory, HTMLInputElement | null>);

  const handleFileSelect = async (category: ServiceCategory, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    setUploadingCategory(category);
    try {
      await uploadImage.mutateAsync({ category, file });
      toast({
        title: 'Image uploaded',
        description: `${categoryLabels[category]} image has been updated.`,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteImage.mutateAsync({
        category: deleteTarget.category,
        imageUrl: deleteTarget.imageUrl,
      });
      toast({
        title: 'Image deleted',
        description: `${categoryLabels[deleteTarget.category]} image has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const categories: ServiceCategory[] = ['breakfast', 'lunch', 'dinner', 'drinks', 'game_drive'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Category Images</h3>
          <p className="text-sm text-muted-foreground">
            Manage hero images for each service category displayed on the Services page
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const categoryImage = categoryImages.find(img => img.category === category);
          const hasImage = categoryImage?.image_url;
          const isUploading = uploadingCategory === category;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    {categoryLabels[category]}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {categoryDescriptions[category]}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {hasImage ? (
                      <img
                        src={categoryImage.image_url!}
                        alt={categoryLabels[category]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No image set</p>
                        </div>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputRefs.current[category] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(category, file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fileInputRefs.current[category]?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {hasImage ? 'Replace' : 'Upload'}
                    </Button>
                    {hasImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteTarget({ category, imageUrl: categoryImage.image_url! })}
                        disabled={isUploading}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the {deleteTarget ? categoryLabels[deleteTarget.category] : ''} image? 
              The default image will be used instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
