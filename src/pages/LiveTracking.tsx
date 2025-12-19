import { useState, useEffect } from 'react';
import { MapPin, Bus, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import BusTrackerCard from '@/components/cards/BusTrackerCard';
import { busRoutes, liveBuses } from '@/data/transportData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bus as BusType } from '@/types/transport';

const LiveTracking = () => {
  const { language, t } = useLanguage();
  const isGu = language.code === 'gu';
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [buses, setBuses] = useState<BusType[]>(liveBuses);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const filteredBuses = selectedRoute 
    ? buses.filter(bus => bus.routeId === selectedRoute)
    : buses;

  const selectedRouteData = busRoutes.find(r => r.id === selectedRoute);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      // Simulate bus movement
      setBuses(prev => prev.map(bus => ({
        ...bus,
        eta: Math.max(1, bus.eta + Math.floor(Math.random() * 3) - 1),
        currentLocation: {
          latitude: bus.currentLocation.latitude + (Math.random() * 0.002 - 0.001),
          longitude: bus.currentLocation.longitude + (Math.random() * 0.002 - 0.001),
        }
      })));
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleRefresh, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('tracking.title')}</h1>
              <p className="text-primary-foreground/80">
                {isGu ? 'રીઅલ-ટાઇમમાં બસની સ્થિતિ જુઓ' : 'View bus locations in real-time'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground">
                {isGu ? 'છેલ્લું અપડેટ:' : 'Last updated:'} {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isGu ? 'રિફ્રેશ' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Map Area */}
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-xl border border-border overflow-hidden h-[500px] relative">
              {/* Simulated Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMCAwaDJ2NDBIMHptMzggMGgydjQwaC0yek0wIDBoNDB2Mkgwem0wIDM4aDQwdjJIMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
                
                {/* City Label */}
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
                  <p className="text-sm font-medium">{isGu ? 'વડોદરા, ગુજરાત' : 'Vadodara, Gujarat'}</p>
                </div>

                {/* Simulated Bus Markers */}
                {filteredBuses.map((bus, index) => {
                  const route = busRoutes.find(r => r.id === bus.routeId);
                  const left = 20 + (index * 15) % 60;
                  const top = 20 + (index * 20) % 60;
                  
                  return (
                    <div
                      key={bus.id}
                      className="absolute transition-all duration-1000 cursor-pointer group"
                      style={{ left: `${left}%`, top: `${top}%` }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse"
                        style={{ backgroundColor: route?.color || '#2563eb' }}
                      >
                        <Bus className="h-5 w-5" />
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground/20 blur-sm" />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-card rounded-lg shadow-lg p-2 text-xs whitespace-nowrap border border-border">
                          <p className="font-medium">{bus.busNumber}</p>
                          <p className="text-muted-foreground">{isGu ? 'આગલું:' : 'Next:'} {bus.nextStop}</p>
                          <p className="text-accent font-medium">{bus.eta} {isGu ? 'મિનિટ' : 'min'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Route Line (if selected) */}
                {selectedRouteData && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                      d="M50,100 Q150,50 250,150 T450,200"
                      fill="none"
                      stroke={selectedRouteData.color}
                      strokeWidth="3"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />
                  </svg>
                )}
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
                <p className="text-xs font-medium mb-2">{isGu ? 'સ્થિતિ' : 'Status'}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span>{isGu ? 'ચાલુ' : 'Running'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span>{isGu ? 'મોડું' : 'Delayed'}</span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="absolute bottom-4 right-4 bg-info/10 backdrop-blur-sm rounded-lg p-3 border border-info/20 max-w-xs">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    {isGu 
                      ? 'આ સિમ્યુલેટેડ ડેટા છે. વાસ્તવિક GPS ડેટા ટૂંક સમયમાં ઉપલબ્ધ થશે.'
                      : 'This is simulated data. Real GPS data will be available soon.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Route Filter */}
            <div className="bg-card rounded-xl border border-border p-4">
              <label className="text-sm font-medium mb-2 block">
                {t('tracking.selectRoute')}
              </label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={isGu ? 'બધા રૂટ' : 'All Routes'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{isGu ? 'બધા રૂટ' : 'All Routes'}</SelectItem>
                  {busRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: route.color }}
                        />
                        {isGu ? route.nameGu : route.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Buses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {isGu ? 'સક્રિય બસો' : 'Active Buses'}
                </h3>
                <Badge variant="secondary">
                  {filteredBuses.length} {isGu ? 'બસો' : 'buses'}
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {filteredBuses.map((bus) => {
                  const route = busRoutes.find(r => r.id === bus.routeId);
                  return (
                    <BusTrackerCard 
                      key={bus.id} 
                      bus={bus} 
                      routeName={route ? (isGu ? route.nameGu : route.name) : undefined}
                    />
                  );
                })}
              </div>

              {filteredBuses.length === 0 && (
                <div className="text-center py-8">
                  <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {isGu ? 'આ રૂટ પર કોઈ બસ ઉપલબ્ધ નથી' : 'No buses available on this route'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LiveTracking;
