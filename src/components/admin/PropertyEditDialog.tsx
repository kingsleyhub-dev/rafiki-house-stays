import { useState, useEffect } from 'react';
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
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property) {
      onSave({ id: property.id, ...formData });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
