import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Service, ServiceCategory } from '@/hooks/useServices';
import { X, Plus } from 'lucide-react';

interface ServiceEditDialogProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Service> & { id?: string }) => void;
  isCreating?: boolean;
}

const categoryLabels: Record<ServiceCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  drinks: 'Drinks',
  game_drive: 'Game Drive',
};

export function ServiceEditDialog({
  service,
  isOpen,
  onClose,
  onSave,
  isCreating = false,
}: ServiceEditDialogProps) {
  const [formData, setFormData] = useState({
    category: 'breakfast' as ServiceCategory,
    name: '',
    description: '',
    price: '',
    duration: '',
    time_slot: '',
    sort_order: 0,
  });
  const [includes, setIncludes] = useState<string[]>([]);
  const [newInclude, setNewInclude] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        category: service.category,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration || '',
        time_slot: service.time_slot || '',
        sort_order: service.sort_order,
      });
      setIncludes(service.includes || []);
    } else if (isCreating) {
      setFormData({
        category: 'breakfast',
        name: '',
        description: '',
        price: '',
        duration: '',
        time_slot: '',
        sort_order: 0,
      });
      setIncludes([]);
    }
  }, [service, isCreating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Service> & { id?: string } = {
      ...formData,
      includes: formData.category === 'game_drive' ? includes : undefined,
      duration: formData.category === 'game_drive' ? formData.duration : undefined,
      time_slot: formData.category === 'game_drive' ? formData.time_slot : undefined,
    };
    
    if (service) {
      data.id = service.id;
    }
    
    onSave(data);
  };

  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const isGameDrive = formData.category === 'game_drive';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Add New Service' : `Edit ${service?.name}`}
          </DialogTitle>
          <DialogDescription>
            {isCreating ? 'Create a new menu item or service.' : 'Update service details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: ServiceCategory) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Full English Breakfast"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the item"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., KES 1,200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {isGameDrive && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 3-4 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_slot">Time Slot</Label>
                  <Input
                    id="time_slot"
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    placeholder="e.g., 6:00 AM - 10:00 AM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>What's Included</Label>
                <div className="flex gap-2">
                  <Input
                    value={newInclude}
                    onChange={(e) => setNewInclude(e.target.value)}
                    placeholder="Add included item"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclude();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddInclude}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {includes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {includes.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveInclude(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isCreating ? 'Create Service' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
