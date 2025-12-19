import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Clock, Navigation, ArrowRightLeft, Ticket, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import RouteCard from '@/components/cards/RouteCard';
import { busStops, busRoutes, findRoutesBetweenStops, calculateFare } from '@/data/transportData';
import { useLanguage } from '@/contexts/LanguageContext';
import { BusRoute } from '@/types/transport';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

const RoutePlanner = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const isGu = language.code === 'gu';
  const [searchParams] = useSearchParams();
  
  const [fromStop, setFromStop] = useState(searchParams.get('from') || '');
  const [toStop, setToStop] = useState(searchParams.get('to') || '');
  const [searchResults, setSearchResults] = useState<BusRoute[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = () => {
    if (fromStop && toStop) {
      const routes = findRoutesBetweenStops(fromStop, toStop);
      setSearchResults(routes);
      setHasSearched(true);
      setSelectedRoute(null);
    }
  };

  const handleSwap = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  const handleBuyTicket = () => {
    if (!user) {
      toast.error(isGu ? 'ટિકિટ ખરીદવા માટે કૃપા કરીને લોગિન કરો' : 'Please login to buy a ticket');
      navigate('/auth');
      return;
    }

    if (!selectedRoute || !fromStopData || !toStopData) return;

    const fare = calculateFare(selectedRoute.distance, 'General');
    navigate(`/payment?type=ticket&category=general&price=${fare}&route=${selectedRoute.routeNumber}&from=${fromStopData.name}&to=${toStopData.name}`);
  };

  const fromStopData = useMemo(() => busStops.find(s => s.id === fromStop), [fromStop]);
  const toStopData = useMemo(() => busStops.find(s => s.id === toStop), [toStop]);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">{t('planner.title')}</h1>
          <p className="text-primary-foreground/80">
            {isGu ? 'તમારા સ્ટોપથી ડેસ્ટિનેશન સુધીના રૂટ શોધો' : 'Find routes from your stop to destination'}
          </p>
        </div>
      </section>

      <section className="container-custom py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Search Panel */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">
                {isGu ? 'તમારી યાત્રા' : 'Your Journey'}
              </h2>
              
              <div className="space-y-4">
                {/* From */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {t('planner.from')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <Select value={fromStop} onValueChange={setFromStop}>
                      <SelectTrigger className="pl-10 h-12">
                        <SelectValue placeholder={t('planner.selectStop')} />
                      </SelectTrigger>
                      <SelectContent>
                        {busStops.map((stop) => (
                          <SelectItem key={stop.id} value={stop.id}>
                            {isGu ? stop.nameGu : stop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleSwap}
                    className="rounded-full"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* To */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {t('planner.to')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                    <Select value={toStop} onValueChange={setToStop}>
                      <SelectTrigger className="pl-10 h-12">
                        <SelectValue placeholder={t('planner.selectStop')} />
                      </SelectTrigger>
                      <SelectContent>
                        {busStops.map((stop) => (
                          <SelectItem key={stop.id} value={stop.id}>
                            {isGu ? stop.nameGu : stop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Button */}
                <Button 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  onClick={handleSearch}
                  disabled={!fromStop || !toStop}
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  {t('planner.search')}
                </Button>
              </div>
            </div>

            {/* Selected Route Details */}
            {selectedRoute && (
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in">
                <h3 className="font-semibold mb-4">
                  {isGu ? 'રૂટ વિગતો' : 'Route Details'}
                </h3>
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold text-white mb-4"
                  style={{ backgroundColor: selectedRoute.color }}
                >
                  {selectedRoute.routeNumber}
                </div>
                <h4 className="font-medium mb-4">{isGu ? selectedRoute.nameGu : selectedRoute.name}</h4>
                
                {/* Stops List */}
                <div className="space-y-0">
                  {selectedRoute.stops.map((stop, index) => {
                    const isFirst = index === 0;
                    const isLast = index === selectedRoute.stops.length - 1;
                    const isHighlighted = stop.id === fromStop || stop.id === toStop;
                    
                    return (
                      <div key={stop.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-3 h-3 rounded-full border-2 ${
                              isHighlighted 
                                ? 'bg-accent border-accent' 
                                : 'bg-card border-muted-foreground'
                            }`}
                          />
                          {!isLast && (
                            <div className="w-0.5 h-8 bg-border" />
                          )}
                        </div>
                        <div className={`pb-4 ${isHighlighted ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          <p className="text-sm">{isGu ? stop.nameGu : stop.name}</p>
                          {isFirst && (
                            <span className="text-xs text-primary">{isGu ? 'શરૂ' : 'Start'}</span>
                          )}
                          {isLast && (
                            <span className="text-xs text-accent">{isGu ? 'અંત' : 'End'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{isGu ? 'પહેલી બસ' : 'First Bus'}</p>
                    <p className="font-medium">{selectedRoute.firstBus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{isGu ? 'છેલ્લી બસ' : 'Last Bus'}</p>
                    <p className="font-medium">{selectedRoute.lastBus}</p>
                  </div>
                </div>

                {/* Fare and Buy Ticket */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{isGu ? 'ટિકિટ ભાડું' : 'Ticket Fare'}</span>
                    <span className="text-xl font-bold text-accent flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {calculateFare(selectedRoute.distance, 'General')}
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={handleBuyTicket}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    {isGu ? 'ટિકિટ ખરીદો' : 'Buy Ticket'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div>
            {!hasSearched ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Navigation className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {isGu ? 'તમારી યાત્રા પ્લાન કરો' : 'Plan Your Journey'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {isGu 
                    ? 'શરૂઆત અને ગંતવ્ય સ્ટોપ પસંદ કરો અને ઉપલબ્ધ રૂટ શોધો'
                    : 'Select your starting and destination stops to find available routes'}
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <MapPin className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('planner.noResults')}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {isGu 
                    ? 'આ સ્ટોપ વચ્ચે સીધો રૂટ ઉપલબ્ધ નથી. કૃપા કરીને નજીકના સ્ટોપ અજમાવો.'
                    : 'No direct route available between these stops. Please try nearby stops.'}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-xl font-semibold">{t('planner.results')}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    {searchResults.length} {isGu ? 'રૂટ મળ્યા' : 'routes found'}
                  </span>
                </div>

                {/* Journey Summary */}
                <div className="bg-muted/50 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{t('planner.from')}</p>
                    <p className="font-medium">{fromStopData && (isGu ? fromStopData.nameGu : fromStopData.name)}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{t('planner.to')}</p>
                    <p className="font-medium">{toStopData && (isGu ? toStopData.nameGu : toStopData.name)}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {searchResults.map((route, index) => (
                    <div
                      key={route.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <RouteCard 
                        route={route} 
                        onClick={() => setSelectedRoute(route)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RoutePlanner;
