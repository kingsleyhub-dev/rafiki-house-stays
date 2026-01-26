import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
}

export function SearchBar({ variant = 'compact' }: SearchBarProps) {
  const navigate = useNavigate();
  const { setSearchParams } = useBooking();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    setSearchParams({ checkIn, checkOut, guests });
    navigate('/stays');
  };

  const isHero = variant === 'hero';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 rounded-xl md:rounded-full p-2 md:p-1 shadow-elevated",
        isHero ? "bg-card md:bg-card/95 backdrop-blur-lg" : "bg-card border border-border"
      )}
    >
      {/* Location */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg md:rounded-full md:border-r border-border",
        isHero ? "md:min-w-[160px]" : ""
      )}>
        <MapPin className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium">Location</p>
          <p className="text-sm font-medium">Nanyuki, Kenya</p>
        </div>
      </div>

      {/* Check-in */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn(
            "flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg md:rounded-none md:border-r border-border hover:bg-muted/50 transition-colors text-left",
            isHero ? "md:min-w-[140px]" : ""
          )}>
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Check-in</p>
              <p className="text-sm font-medium">
                {checkIn ? format(checkIn, 'MMM d') : 'Add date'}
              </p>
            </div>
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

      {/* Check-out */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn(
            "flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg md:rounded-none md:border-r border-border hover:bg-muted/50 transition-colors text-left",
            isHero ? "md:min-w-[140px]" : ""
          )}>
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Check-out</p>
              <p className="text-sm font-medium">
                {checkOut ? format(checkOut, 'MMM d') : 'Add date'}
              </p>
            </div>
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

      {/* Guests */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn(
            "flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg md:rounded-none hover:bg-muted/50 transition-colors text-left",
            isHero ? "md:min-w-[120px]" : ""
          )}>
            <Users className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Guests</p>
              <p className="text-sm font-medium">{guests} guests</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-4">
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
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        size={isHero ? "lg" : "default"}
        className={cn(
          "md:ml-1 gap-2",
          isHero ? "md:rounded-full" : ""
        )}
      >
        <Search className="h-4 w-4" />
        <span className="md:hidden lg:inline">Search</span>
      </Button>
    </motion.div>
  );
}
