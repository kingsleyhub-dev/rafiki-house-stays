import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import {
  useAllAmenities,
  useCreateAmenity,
  useUpdateAmenity,
  useDeleteAmenity,
  useToggleAmenityStatus,
  Amenity,
} from '@/hooks/useAmenities';
import { toast } from '@/hooks/use-toast';

export function AmenitiesManager() {
  const { data: amenities = [], isLoading } = useAllAmenities();
  const createAmenity = useCreateAmenity();
  const updateAmenity = useUpdateAmenity();
  const deleteAmenity = useDeleteAmenity();
  const toggleStatus = useToggleAmenityStatus();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteAmenityId, setDeleteAmenityId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '', sort_order: 0 });

  const handleOpenCreate = () => {
    setEditingAmenity(null);
    setFormData({ name: '', icon: '', sort_order: amenities.length + 1 });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      icon: amenity.icon || '',
      sort_order: amenity.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingAmenity) {
        await updateAmenity.mutateAsync({
          id: editingAmenity.id,
          name: formData.name,
          icon: formData.icon || null,
          sort_order: formData.sort_order,
        });
        toast({ title: 'Amenity updated', description: 'Changes saved successfully.' });
      } else {
        await createAmenity.mutateAsync({
          name: formData.name,
          icon: formData.icon || undefined,
          sort_order: formData.sort_order,
        });
        toast({ title: 'Amenity created', description: 'New amenity added successfully.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save amenity.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteAmenityId) return;
    try {
      await deleteAmenity.mutateAsync(deleteAmenityId);
      setDeleteAmenityId(null);
      toast({ title: 'Amenity deleted', description: 'The amenity has been removed.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete amenity.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus.mutateAsync({ id, isActive: !currentStatus });
      toast({
        title: 'Status updated',
        description: `Amenity is now ${!currentStatus ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Manage Amenities</h3>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Amenity
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No amenities found. Add your first amenity.
                </TableCell>
              </TableRow>
            ) : (
              amenities.map((amenity) => (
                <TableRow key={amenity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                      {amenity.sort_order}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{amenity.name}</TableCell>
                  <TableCell>
                    <Badge variant={amenity.is_active ? 'default' : 'secondary'}>
                      {amenity.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(amenity.id, amenity.is_active)}
                        title={amenity.is_active ? 'Hide' : 'Show'}
                      >
                        {amenity.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(amenity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteAmenityId(amenity.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
            </DialogTitle>
            <DialogDescription>
              {editingAmenity ? 'Update the amenity details.' : 'Create a new amenity for properties.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Swimming Pool"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {editingAmenity ? 'Save Changes' : 'Create Amenity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAmenityId} onOpenChange={() => setDeleteAmenityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Amenity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this amenity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
