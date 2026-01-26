export interface Property {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  nightlyPrice: number;
  maxGuests: number;
  beds: number;
  baths: number;
  amenities: string[];
  imageUrls: string[];
  homeType: string;
  location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nightlyPrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'admin';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface SearchParams {
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
}
