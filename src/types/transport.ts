// Types for Vadodara Bus Transport System

export interface BusStop {
  id: string;
  name: string;
  nameGu: string; // Gujarati name
  latitude: number;
  longitude: number;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  name: string;
  nameGu: string;
  startPoint: string;
  endPoint: string;
  stops: BusStop[];
  distance: number; // in km
  estimatedTime: number; // in minutes
  firstBus: string;
  lastBus: string;
  frequency: string;
  fare: number;
  color: string;
}

export interface Bus {
  id: string;
  busNumber: string;
  routeId: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  nextStop: string;
  eta: number; // minutes
  occupancy: 'low' | 'medium' | 'high';
  status: 'running' | 'delayed' | 'stopped';
}

export interface FareInfo {
  category: string;
  categoryGu: string;
  description: string;
  baseFare: number;
  perKm: number;
  monthlyPass?: number;
  documents?: string[];
}

export interface Complaint {
  id: string;
  busNumber: string;
  routeNumber: string;
  category: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: Date;
  passengerName?: string;
  phone?: string;
  email?: string;
}

export interface ServiceAlert {
  id: string;
  title: string;
  titleGu: string;
  description: string;
  descriptionGu: string;
  type: 'info' | 'warning' | 'disruption';
  validFrom: Date;
  validTo: Date;
  affectedRoutes?: string[];
}

export interface Language {
  code: 'en' | 'gu';
  name: string;
}
