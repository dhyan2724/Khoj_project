import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Clock, Download, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface BusStop {
  id: string;
  name: string;
  name_gu: string | null;
  latitude: number;
  longitude: number;
}

interface RouteStop {
  id: string;
  stop_order: number;
  stop: BusStop;
}

interface BusRoute {
  id: string;
  route_number: string;
  name: string;
  name_gu: string | null;
  start_point: string;
  end_point: string;
  distance: number | null;
  estimated_time: number | null;
  first_bus: string | null;
  last_bus: string | null;
  frequency: string | null;
  fare: number | null;
  color: string | null;
  route_stops: RouteStop[];
}

const RouteDetail = () => {
  const { routeNumber } = useParams<{ routeNumber: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isGu = language.code === 'gu';
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!routeNumber) {
        setError(isGu ? 'રૂટ નંબર મળ્યો નથી' : 'Route number not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch route
        const { data: routeData, error: routeError } = await supabase
          .from('bus_routes')
          .select('*')
          .eq('route_number', routeNumber)
          .single();

        if (routeError) {
          throw routeError;
        }

        if (!routeData) {
          setError(isGu ? 'રૂટ મળ્યો નથી' : 'Route not found');
          setLoading(false);
          return;
        }

        // Fetch route stops with bus stops
        const { data: routeStopsData, error: stopsError } = await supabase
          .from('route_stops')
          .select(`
            id,
            stop_order,
            bus_stops (
              id,
              name,
              name_gu,
              latitude,
              longitude
            )
          `)
          .eq('route_id', routeData.id)
          .order('stop_order', { ascending: true });

        if (stopsError) {
          throw stopsError;
        }

        // Map to correct structure
        const sortedStops = ((routeStopsData || []) as any[]).map((rs: any) => ({
          id: rs.id,
          stop_order: rs.stop_order,
          stop: rs.bus_stops
        }));

        setRoute({
          ...routeData,
          route_stops: sortedStops,
        } as BusRoute);
      } catch (err: any) {
        console.error('Error fetching route:', err);
        setError(err.message || (isGu ? 'રૂટ લાવવામાં ભૂલ' : 'Error loading route'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [routeNumber, isGu]);

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  if (error || !route) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <Button variant="ghost" onClick={() => navigate('/routes')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isGu ? 'રૂટ્સ પર પાછા જાઓ' : 'Back to Routes'}
          </Button>
          <div className="text-center py-12">
            <p className="text-destructive text-lg mb-4">
              {error || (isGu ? 'રૂટ મળ્યો નથી' : 'Route not found')}
            </p>
            <Button onClick={() => navigate('/routes')}>
              {isGu ? 'બધા રૂટ્સ જુઓ' : 'View All Routes'}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const stops = route.route_stops.map(rs => rs.stop);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <Button
            variant="ghost"
            onClick={() => navigate('/routes')}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isGu ? 'રૂટ્સ પર પાછા જાઓ' : 'Back to Routes'}
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: route.color || '#2563eb' }}
              >
                {route.route_number}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {isGu && route.name_gu ? route.name_gu : route.name}
                </h1>
                <p className="text-primary-foreground/80 flex items-center gap-2">
                  {route.start_point} <ArrowRight className="h-4 w-4" /> {route.end_point}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGu ? 'ડાઉનલોડ કરો' : 'Download'}
            </Button>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {/* Route Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {route.distance && (
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {isGu ? 'અંતર' : 'Distance'}
              </p>
              <p className="text-2xl font-bold">{route.distance} km</p>
            </div>
          )}
          {route.estimated_time && (
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {isGu ? 'અંદાજિત સમય' : 'Estimated Time'}
              </p>
              <p className="text-2xl font-bold">{route.estimated_time} {isGu ? 'મિનિટ' : 'min'}</p>
            </div>
          )}
          {route.fare && (
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {isGu ? 'ભાડું' : 'Fare'}
              </p>
              <p className="text-2xl font-bold text-accent">₹{route.fare}</p>
            </div>
          )}
          {route.frequency && (
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">
                {isGu ? 'આવર્તન' : 'Frequency'}
              </p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <Clock className="h-5 w-5" />
                {route.frequency}
              </p>
            </div>
          )}
        </div>

        {/* Timings */}
        {(route.first_bus || route.last_bus) && (
          <div className="bg-card rounded-lg border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {isGu ? 'બસ સમય' : 'Bus Timings'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {route.first_bus && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {isGu ? 'પ્રથમ બસ' : 'First Bus'}
                  </p>
                  <p className="text-lg font-semibold">{route.first_bus}</p>
                </div>
              )}
              {route.last_bus && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {isGu ? 'છેલ્લી બસ' : 'Last Bus'}
                  </p>
                  <p className="text-lg font-semibold">{route.last_bus}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stops List */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {isGu ? 'બસ સ્ટોપ્સ' : 'Bus Stops'}
            </h2>
            <Badge variant="secondary">
              {stops.length} {isGu ? 'સ્ટોપ્સ' : 'stops'}
            </Badge>
          </div>

          <div className="space-y-0 max-h-[600px] overflow-y-auto">
            {stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              const isFirst = index === 0;
              return (
                <div key={stop.id} className="flex items-start gap-4 py-3">
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isFirst || isLast
                          ? 'bg-accent border-accent'
                          : 'bg-card border-muted-foreground'
                      }`}
                    >
                      {isFirst && <span className="text-[8px] text-white font-bold">S</span>}
                      {isLast && <span className="text-[8px] text-white font-bold">E</span>}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-8 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isFirst || isLast ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {isGu && stop.name_gu ? stop.name_gu : stop.name}
                    </p>
                    {(isFirst || isLast) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {isFirst
                          ? isGu
                            ? 'પ્રારંભિક બિંદુ'
                            : 'Starting Point'
                          : isGu
                          ? 'અંતિમ બિંદુ'
                          : 'Ending Point'}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="flex-1"
          >
            <Link to={`/route-planner?from=${encodeURIComponent(stops[0]?.name || '')}&to=${encodeURIComponent(stops[stops.length - 1]?.name || '')}`}>
              {isGu ? 'રૂટ પ્લાનરમાં જુઓ' : 'View in Route Planner'}
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/fare')}
          >
            {isGu ? 'ભાડું જુઓ' : 'View Fare'}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default RouteDetail;
