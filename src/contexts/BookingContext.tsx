import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, SearchParams } from '@/types';

interface BookingContextType {
  bookings: Booking[];
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getBookingsByProperty: (propertyId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Demo bookings for MVP
const initialBookings: Booking[] = [
  {
    id: '1',
    propertyId: '1',
    userId: '2',
    checkIn: '2026-02-10',
    checkOut: '2026-02-14',
    guests: 2,
    nightlyPrice: 18500,
    totalPrice: 74000,
    status: 'confirmed',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '2',
    propertyId: '4',
    userId: '2',
    checkIn: '2026-03-01',
    checkOut: '2026-03-05',
    guests: 6,
    nightlyPrice: 32000,
    totalPrice: 128000,
    status: 'pending',
    createdAt: '2026-01-20T14:30:00Z',
  },
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter(b => b.userId === userId);
  };

  const getBookingsByProperty = (propertyId: string) => {
    return bookings.filter(b => b.propertyId === propertyId);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        searchParams,
        setSearchParams,
        addBooking,
        updateBookingStatus,
        getBookingsByUser,
        getBookingsByProperty,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
