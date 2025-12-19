import { BusStop, BusRoute, Bus, FareInfo, ServiceAlert } from '@/types/transport';

// Vadodara Bus Stops
export const busStops: BusStop[] = [
  { id: 'stop-1', name: 'Vadodara Railway Station', nameGu: 'વડોદરા રેલ્વે સ્ટેશન', latitude: 22.3119, longitude: 73.1868 },
  { id: 'stop-2', name: 'Sayajigunj', nameGu: 'સયાજીગંજ', latitude: 22.3103, longitude: 73.1918 },
  { id: 'stop-3', name: 'Alkapuri', nameGu: 'અલકાપુરી', latitude: 22.3086, longitude: 73.1725 },
  { id: 'stop-4', name: 'Race Course', nameGu: 'રેસ કોર્સ', latitude: 22.3234, longitude: 73.1673 },
  { id: 'stop-5', name: 'Fatehgunj', nameGu: 'ફતેગંજ', latitude: 22.3258, longitude: 73.1812 },
  { id: 'stop-6', name: 'Manjalpur', nameGu: 'માંજલપુર', latitude: 22.2676, longitude: 73.1934 },
  { id: 'stop-7', name: 'Gotri', nameGu: 'ગોત્રી', latitude: 22.3389, longitude: 73.1389 },
  { id: 'stop-8', name: 'Karelibaug', nameGu: 'કરેલીબાગ', latitude: 22.3289, longitude: 73.2012 },
  { id: 'stop-9', name: 'Akota', nameGu: 'અકોટા', latitude: 22.2953, longitude: 73.1678 },
  { id: 'stop-10', name: 'Nizampura', nameGu: 'નિઝામપુરા', latitude: 22.3178, longitude: 73.2089 },
  { id: 'stop-11', name: 'Productivity Road', nameGu: 'પ્રોડક્ટિવિટી રોડ', latitude: 22.3012, longitude: 73.1589 },
  { id: 'stop-12', name: 'GIDC Makarpura', nameGu: 'જીઆઈડીસી મકરપુરા', latitude: 22.2534, longitude: 73.2145 },
  { id: 'stop-13', name: 'Pratapnagar', nameGu: 'પ્રતાપનગર', latitude: 22.2878, longitude: 73.2234 },
  { id: 'stop-14', name: 'Waghodia Road', nameGu: 'વાઘોડિયા રોડ', latitude: 22.3367, longitude: 73.2178 },
  { id: 'stop-15', name: 'MS University', nameGu: 'એમએસ યુનિવર્સિટી', latitude: 22.3145, longitude: 73.1798 },
];

// Bus Routes
export const busRoutes: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: '1',
    name: 'Railway Station - Manjalpur',
    nameGu: 'રેલ્વે સ્ટેશન - માંજલપુર',
    startPoint: 'Vadodara Railway Station',
    endPoint: 'Manjalpur',
    stops: [busStops[0], busStops[1], busStops[2], busStops[8], busStops[5]],
    distance: 12.5,
    estimatedTime: 45,
    firstBus: '05:30',
    lastBus: '22:30',
    frequency: '15 mins',
    fare: 15,
    color: '#2563eb',
  },
  {
    id: 'route-2',
    routeNumber: '2',
    name: 'Railway Station - Gotri',
    nameGu: 'રેલ્વે સ્ટેશન - ગોત્રી',
    startPoint: 'Vadodara Railway Station',
    endPoint: 'Gotri',
    stops: [busStops[0], busStops[1], busStops[3], busStops[6]],
    distance: 10.2,
    estimatedTime: 35,
    firstBus: '06:00',
    lastBus: '22:00',
    frequency: '20 mins',
    fare: 12,
    color: '#16a34a',
  },
  {
    id: 'route-3',
    routeNumber: '3',
    name: 'Alkapuri - Karelibaug',
    nameGu: 'અલકાપુરી - કરેલીબાગ',
    startPoint: 'Alkapuri',
    endPoint: 'Karelibaug',
    stops: [busStops[2], busStops[14], busStops[4], busStops[7]],
    distance: 8.7,
    estimatedTime: 30,
    firstBus: '06:00',
    lastBus: '21:30',
    frequency: '12 mins',
    fare: 10,
    color: '#dc2626',
  },
  {
    id: 'route-4',
    routeNumber: '4',
    name: 'Fatehgunj - GIDC Makarpura',
    nameGu: 'ફતેગંજ - જીઆઈડીસી મકરપુરા',
    startPoint: 'Fatehgunj',
    endPoint: 'GIDC Makarpura',
    stops: [busStops[4], busStops[9], busStops[12], busStops[11]],
    distance: 15.3,
    estimatedTime: 50,
    firstBus: '05:00',
    lastBus: '23:00',
    frequency: '10 mins',
    fare: 18,
    color: '#9333ea',
  },
  {
    id: 'route-5',
    routeNumber: '5',
    name: 'Race Course - Waghodia Road',
    nameGu: 'રેસ કોર્સ - વાઘોડિયા રોડ',
    startPoint: 'Race Course',
    endPoint: 'Waghodia Road',
    stops: [busStops[3], busStops[4], busStops[7], busStops[13]],
    distance: 9.8,
    estimatedTime: 35,
    firstBus: '06:30',
    lastBus: '21:00',
    frequency: '15 mins',
    fare: 12,
    color: '#ea580c',
  },
  {
    id: 'route-6',
    routeNumber: '6',
    name: 'Akota - Nizampura',
    nameGu: 'અકોટા - નિઝામપુરા',
    startPoint: 'Akota',
    endPoint: 'Nizampura',
    stops: [busStops[8], busStops[10], busStops[2], busStops[14], busStops[9]],
    distance: 11.2,
    estimatedTime: 40,
    firstBus: '06:00',
    lastBus: '22:00',
    frequency: '18 mins',
    fare: 14,
    color: '#0891b2',
  },
];

// Live Buses (Simulated)
export const liveBuses: Bus[] = [
  {
    id: 'bus-1',
    busNumber: 'GJ-06-AB-1234',
    routeId: 'route-1',
    currentLocation: { latitude: 22.3050, longitude: 73.1850 },
    nextStop: 'Alkapuri',
    eta: 5,
    occupancy: 'medium',
    status: 'running',
  },
  {
    id: 'bus-2',
    busNumber: 'GJ-06-CD-5678',
    routeId: 'route-1',
    currentLocation: { latitude: 22.2800, longitude: 73.1900 },
    nextStop: 'Manjalpur',
    eta: 12,
    occupancy: 'low',
    status: 'running',
  },
  {
    id: 'bus-3',
    busNumber: 'GJ-06-EF-9012',
    routeId: 'route-2',
    currentLocation: { latitude: 22.3200, longitude: 73.1600 },
    nextStop: 'Gotri',
    eta: 8,
    occupancy: 'high',
    status: 'running',
  },
  {
    id: 'bus-4',
    busNumber: 'GJ-06-GH-3456',
    routeId: 'route-3',
    currentLocation: { latitude: 22.3150, longitude: 73.1900 },
    nextStop: 'Karelibaug',
    eta: 15,
    occupancy: 'medium',
    status: 'delayed',
  },
  {
    id: 'bus-5',
    busNumber: 'GJ-06-IJ-7890',
    routeId: 'route-4',
    currentLocation: { latitude: 22.2700, longitude: 73.2100 },
    nextStop: 'GIDC Makarpura',
    eta: 10,
    occupancy: 'low',
    status: 'running',
  },
];

// Fare Information
export const fareInfo: FareInfo[] = [
  {
    category: 'General',
    categoryGu: 'સામાન્ય',
    description: 'Standard fare for all passengers',
    baseFare: 5,
    perKm: 1.5,
  },
  {
    category: 'Student',
    categoryGu: 'વિદ્યાર્થી',
    description: '50% discount for students with valid ID',
    baseFare: 2.5,
    perKm: 0.75,
    monthlyPass: 300,
    documents: ['Valid Student ID', 'School/College Bonafide Certificate', 'Passport Photo'],
  },
  {
    category: 'Senior Citizen',
    categoryGu: 'વરિષ્ઠ નાગરિક',
    description: '40% discount for citizens above 60 years',
    baseFare: 3,
    perKm: 0.9,
    monthlyPass: 400,
    documents: ['Age Proof (Aadhar/Pan)', 'Passport Photo', 'Address Proof'],
  },
  {
    category: 'Monthly Pass',
    categoryGu: 'માસિક પાસ',
    description: 'Unlimited travel on all routes',
    baseFare: 0,
    perKm: 0,
    monthlyPass: 800,
    documents: ['Aadhar Card', 'Passport Photo', 'Address Proof'],
  },
  {
    category: 'Women Special',
    categoryGu: 'મહિલા વિશેષ',
    description: '25% discount for women passengers',
    baseFare: 3.75,
    perKm: 1.125,
    monthlyPass: 600,
    documents: ['Aadhar Card', 'Passport Photo'],
  },
];

// Service Alerts
export const serviceAlerts: ServiceAlert[] = [
  {
    id: 'alert-1',
    title: 'Route 4 Diversion',
    titleGu: 'રૂટ ૪ ડાયવર્ઝન',
    description: 'Due to road construction near Pratapnagar, Route 4 buses will take alternate route via Nizampura.',
    descriptionGu: 'પ્રતાપનગર નજીક રોડ બાંધકામને કારણે, રૂટ ૪ ની બસો નિઝામપુરા થઈને વૈકલ્પિક માર્ગ લેશે.',
    type: 'warning',
    validFrom: new Date('2024-01-15'),
    validTo: new Date('2024-02-15'),
    affectedRoutes: ['4'],
  },
  {
    id: 'alert-2',
    title: 'Extended Service Hours',
    titleGu: 'વિસ્તૃત સેવા સમય',
    description: 'Festival special: All routes will operate extended hours till midnight during Navratri.',
    descriptionGu: 'તહેવાર વિશેષ: નવરાત્રિ દરમિયાન તમામ રૂટ મધ્યરાત્રિ સુધી વિસ્તૃત કલાકો સુધી કાર્યરત રહેશે.',
    type: 'info',
    validFrom: new Date('2024-10-03'),
    validTo: new Date('2024-10-12'),
  },
  {
    id: 'alert-3',
    title: 'New Route Launch',
    titleGu: 'નવો રૂટ લોન્ચ',
    description: 'Route 7 connecting Sama to Harni will start from next Monday. Frequency: Every 20 minutes.',
    descriptionGu: 'સમા થી હરણી જોડતો રૂટ ૭ આવતા સોમવારથી શરૂ થશે. આવર્તન: દર ૨૦ મિનિટ.',
    type: 'info',
    validFrom: new Date('2024-01-20'),
    validTo: new Date('2024-12-31'),
  },
];

// Helper function to find routes between stops
export const findRoutesBetweenStops = (fromStopId: string, toStopId: string): BusRoute[] => {
  return busRoutes.filter(route => {
    const stopIds = route.stops.map(s => s.id);
    const fromIndex = stopIds.indexOf(fromStopId);
    const toIndex = stopIds.indexOf(toStopId);
    return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
  });
};

// Helper function to calculate fare
export const calculateFare = (distance: number, category: string = 'General'): number => {
  const fare = fareInfo.find(f => f.category === category);
  if (!fare) return 0;
  return Math.round(fare.baseFare + (distance * fare.perKm));
};
