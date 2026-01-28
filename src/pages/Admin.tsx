import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Calendar, Users, Settings, Check, X, Clock,
  Edit, Trash2, Eye, EyeOff, Shield, Loader2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { useAuth } from '@/contexts/AuthContext';
import { useIsAdmin } from '@/hooks/useAdminAuth';
import {
  useAllProperties,
  useAllBookings,
  useAdminUpdateBookingStatus,
  useUpdatePropertyStatus,
  useUpdateProperty,
  useDeleteBooking,
} from '@/hooks/useAdminData';
import { PropertyEditDialog } from '@/components/admin/PropertyEditDialog';
import { toast } from '@/hooks/use-toast';
import { Property } from '@/types';

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);

  const { data: properties = [], isLoading: propertiesLoading } = useAllProperties();
  const { data: bookings = [], isLoading: bookingsLoading } = useAllBookings();
  
  const updateBookingStatus = useAdminUpdateBookingStatus();
  const updatePropertyStatus = useUpdatePropertyStatus();
  const updateProperty = useUpdateProperty();
  const deleteBooking = useDeleteBooking();

  // Show loading state while checking auth
  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin portal.
            </p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-accent text-accent-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (propertyFilter !== 'all' && booking.property_id !== propertyFilter) return false;
    return true;
  });

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus.mutateAsync({ id: bookingId, status: newStatus });
      toast({
        title: 'Booking updated',
        description: `Booking status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status.',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      await updatePropertyStatus.mutateAsync({ id: propertyId, isActive: !currentStatus });
      toast({
        title: 'Property updated',
        description: `Property is now ${!currentStatus ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property status.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveProperty = async (data: {
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
  }) => {
    try {
      await updateProperty.mutateAsync(data);
      setEditingProperty(null);
      toast({
        title: 'Property updated',
        description: 'Property details have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteBookingId) return;
    try {
      await deleteBooking.mutateAsync(deleteBookingId);
      setDeleteBookingId(null);
      toast({
        title: 'Booking deleted',
        description: 'The booking has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete booking.',
        variant: 'destructive',
      });
    }
  };

  const stats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.isActive).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.total_price, 0),
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage properties, bookings, and users
              </p>
            </div>
            <Badge variant="outline" className="text-primary">
              <Shield className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Properties</p>
                  <p className="text-2xl font-bold">{stats.activeProperties}/{stats.totalProperties}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{stats.confirmedBookings}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="properties" className="gap-2">
                <Home className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {properties.map(prop => (
                      <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bookings Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((booking) => {
                          const property = properties.find(p => p.id === booking.property_id);
                          return (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {property?.name || 'Unknown'}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {format(parseISO(booking.check_in), 'MMM d')} →{' '}
                                  {format(parseISO(booking.check_out), 'MMM d, yyyy')}
                                </div>
                              </TableCell>
                              <TableCell>{booking.guests}</TableCell>
                              <TableCell>{formatPrice(booking.total_price)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {booking.status === 'pending' && (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        <Check className="h-4 w-4 text-primary" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8"
                                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                        disabled={updateBookingStatus.isPending}
                                      >
                                        <X className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => setDeleteBookingId(booking.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {propertiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price/Night</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={property.imageUrls[0] || '/placeholder.svg'}
                                alt={property.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium">{property.name}</p>
                                <p className="text-sm text-muted-foreground">{property.slug}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{property.homeType}</TableCell>
                          <TableCell>{formatPrice(property.nightlyPrice)}</TableCell>
                          <TableCell>
                            {property.maxGuests} guests · {property.beds} beds
                          </TableCell>
                          <TableCell>
                            <Badge variant={property.isActive ? 'default' : 'secondary'}>
                              {property.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => setEditingProperty(property)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleTogglePropertyStatus(property.id, property.isActive)}
                                disabled={updatePropertyStatus.isPending}
                              >
                                {property.isActive ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground mb-4">
                  View users who have made bookings and their booking history.
                </p>
                <div className="text-sm text-muted-foreground">
                  Total unique guests: {new Set(bookings.map(b => b.user_id)).size}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Property Dialog */}
      <PropertyEditDialog
        property={editingProperty}
        open={!!editingProperty}
        onOpenChange={(open) => !open && setEditingProperty(null)}
        onSave={handleSaveProperty}
        isLoading={updateProperty.isPending}
      />

      {/* Delete Booking Confirmation */}
      <AlertDialog open={!!deleteBookingId} onOpenChange={(open) => !open && setDeleteBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
