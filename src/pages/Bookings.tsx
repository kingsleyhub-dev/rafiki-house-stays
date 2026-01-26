import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { format, differenceInDays, isPast, parseISO } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { getPropertyById } from '@/data/properties';

export default function Bookings() {
  const { user } = useAuth();
  const { getBookingsByUser } = useBooking();

  if (!user) {
    return <Navigate to="/login" state={{ from: '/bookings' }} replace />;
  }

  const bookings = getBookingsByUser(user.id);
  const upcomingBookings = bookings.filter(b => !isPast(parseISO(b.checkIn)));
  const pastBookings = bookings.filter(b => isPast(parseISO(b.checkIn)));

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

  const BookingCard = ({ booking, isPast = false }: { booking: typeof bookings[0]; isPast?: boolean }) => {
    const property = getPropertyById(booking.propertyId);
    if (!property) return null;

    const nights = differenceInDays(parseISO(booking.checkOut), parseISO(booking.checkIn));

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card rounded-xl border border-border overflow-hidden ${isPast ? 'opacity-70' : ''}`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-48 aspect-video md:aspect-auto flex-shrink-0">
            <img
              src={property.imageUrls[0] || '/placeholder.svg'}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <Link
                  to={`/stays/${property.slug}`}
                  className="font-display text-lg font-semibold hover:text-primary transition-colors"
                >
                  {property.name}
                </Link>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{property.location.city}, {property.location.country}</span>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Check-in</p>
                  <p className="font-medium">{format(parseISO(booking.checkIn), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Check-out</p>
                  <p className="font-medium">{format(parseISO(booking.checkOut), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Guests</p>
                  <p className="font-medium">{booking.guests}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="ml-2 font-display text-lg font-semibold">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/stays/${property.slug}`}>
                  View Property <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-8">
            Manage your upcoming and past reservations
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring our beautiful homes and make your first reservation.
            </p>
            <Button asChild>
              <Link to="/stays">Browse Stays</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-4">Upcoming</h2>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-4">Past</h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isPast />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
