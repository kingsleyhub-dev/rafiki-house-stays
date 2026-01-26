import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, Info } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Property } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface BookingWidgetProps {
  property: Property;
}

export function BookingWidget({ property }: BookingWidgetProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking, searchParams } = useBooking();
  
  const [checkIn, setCheckIn] = useState<Date | undefined>(searchParams.checkIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(searchParams.checkOut);
  const [guests, setGuests] = useState(searchParams.guests || 2);
  const [isLoading, setIsLoading] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(checkOut, checkIn);
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    return nights * property.nightlyPrice;
  }, [nights, property.nightlyPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/stays/${property.slug}` } });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({
        title: 'Please select dates',
        description: 'Choose your check-in and check-out dates to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (guests > property.maxGuests) {
      toast({
        title: 'Too many guests',
        description: `This property accommodates up to ${property.maxGuests} guests.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addBooking({
        propertyId: property.id,
        userId: user.id,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests,
        nightlyPrice: property.nightlyPrice,
        totalPrice,
        status: 'pending',
      });

      toast({
        title: 'Booking request submitted!',
        description: 'We\'ll confirm your reservation shortly.',
      });

      navigate('/bookings');
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6 shadow-card sticky top-24"
    >
      {/* Price Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="font-display text-2xl font-bold">{formatPrice(property.nightlyPrice)}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
        {property.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{property.rating}</span>
            <span className="text-muted-foreground text-sm">({property.reviewCount} reviews)</span>
          </div>
        )}
      </div>

      {/* Date & Guest Selection */}
      <div className="border border-border rounded-lg overflow-hidden mb-4">
        {/* Dates */}
        <div className="grid grid-cols-2 divide-x divide-border">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-3 text-left hover:bg-muted/50 transition-colors">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Check-in</p>
                <p className="text-sm font-medium">
                  {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Add date'}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="p-3 text-left hover:bg-muted/50 transition-colors">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Check-out</p>
                <p className="text-sm font-medium">
                  {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Add date'}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < (checkIn || new Date())}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="border-t border-border">
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Guests</p>
                  <p className="text-sm font-medium">{guests} guest{guests !== 1 ? 's' : ''}</p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="flex items-center justify-between">
                <span className="font-medium">Guests</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Max {property.maxGuests} guests
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Book Button */}
      <Button
        onClick={handleBooking}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? 'Processing...' : user ? 'Request to Book' : 'Sign in to Book'}
      </Button>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="mt-6 space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground underline decoration-dashed cursor-help">
              {formatPrice(property.nightlyPrice)} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service fee</span>
            <span>Included</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
        <Info className="h-3 w-3" />
        You won't be charged yet
      </p>
    </motion.div>
  );
}
