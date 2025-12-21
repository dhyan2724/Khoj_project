import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Clock, Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RouteWithStopsCount {
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
  stops_count: number;
}

const Routes = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const isGu = language.code === 'gu';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<RouteWithStopsCount | null>(null);
  const [routes, setRoutes] = useState<RouteWithStopsCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        
        // Fetch all routes
        const { data: routesData, error: routesError } = await supabase
          .from('bus_routes')
          .select('*')
          .order('route_number', { ascending: true });

        if (routesError) {
          throw routesError;
        }

        if (!routesData || routesData.length === 0) {
          setRoutes([]);
          setLoading(false);
          return;
        }

        // Fetch stops count for each route
        const routesWithStops = await Promise.all(
          routesData.map(async (route) => {
            const { count, error: countError } = await supabase
              .from('route_stops')
              .select('*', { count: 'exact', head: true })
              .eq('route_id', route.id);

            return {
              ...route,
              stops_count: countError ? 0 : (count || 0),
            };
          })
        );

        setRoutes(routesWithStops);
      } catch (err: any) {
        console.error('Error fetching routes:', err);
        setError(err.message || (isGu ? 'રૂટ્સ લાવવામાં ભૂલ' : 'Error loading routes'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [isGu]);

  const filteredRoutes = routes.filter((route) => {
    const search = searchTerm.toLowerCase();
    return (
      route.route_number.toLowerCase().includes(search) ||
      route.name.toLowerCase().includes(search) ||
      (route.name_gu?.toLowerCase().includes(search) || false) ||
      route.start_point.toLowerCase().includes(search) ||
      route.end_point.toLowerCase().includes(search)
    );
  });

  const handleDownload = () => {
    const timetableData = routes.map(route => ({
      route: route.route_number,
      name: route.name,
      firstBus: route.first_bus,
      lastBus: route.last_bus,
      frequency: route.frequency,
    }));
    
    const blob = new Blob([JSON.stringify(timetableData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vadodara-bus-timetable.json';
    a.click();
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('routes.title')}</h1>
              <p className="text-primary-foreground/80">
                {isGu ? 'તમામ શહેરી બસ રૂટ અને સમયપત્રક' : 'All city bus routes and timetable'}
              </p>
            </div>
            <Button 
              onClick={handleDownload}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('routes.download')}
            </Button>
          </div>
        </div>
      </section>

      <section className="container-custom py-8">
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={isGu ? 'રૂટ શોધો...' : 'Search routes...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Routes Table */}
        {loading ? (
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {isGu ? 'ફરીથી પ્રયાસ કરો' : 'Retry'}
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold text-foreground">{t('routes.routeNumber')}</th>
                    <th className="text-left p-4 font-semibold text-foreground">{isGu ? 'રૂટ નામ' : 'Route Name'}</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">{t('routes.stops')}</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden lg:table-cell">{t('routes.firstBus')}</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden lg:table-cell">{t('routes.lastBus')}</th>
                    <th className="text-left p-4 font-semibold text-foreground">{t('routes.frequency')}</th>
                    <th className="text-left p-4 font-semibold text-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => (
                    <tr 
                      key={route.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div 
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold text-white"
                          style={{ backgroundColor: route.color || '#2563eb' }}
                        >
                          {route.route_number}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{isGu && route.name_gu ? route.name_gu : route.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            {route.start_point} <ArrowRight className="h-3 w-3" /> {route.end_point}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant="secondary">{route.stops_count} {isGu ? 'સ્ટોપ' : 'stops'}</Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-foreground">{route.first_bus || '-'}</td>
                      <td className="p-4 hidden lg:table-cell text-foreground">{route.last_bus || '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {route.frequency || '-'}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/routes/${route.route_number}`);
                          }}
                        >
                          {t('common.viewDetails')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredRoutes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {isGu ? 'કોઈ રૂટ મળ્યો નથી' : 'No routes found'}
            </p>
          </div>
        )}
      </section>

      {/* Route Detail Dialog */}
      <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
        <DialogContent className="max-w-lg">
          {selectedRoute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selectedRoute.color || '#2563eb' }}
                  >
                    {selectedRoute.route_number}
                  </div>
                  <div>
                    <p className="text-lg">{isGu && selectedRoute.name_gu ? selectedRoute.name_gu : selectedRoute.name}</p>
                    <p className="text-sm text-muted-foreground font-normal">
                      {selectedRoute.distance ? `${selectedRoute.distance} km` : ''} 
                      {selectedRoute.distance && selectedRoute.estimated_time ? ' • ' : ''}
                      {selectedRoute.estimated_time ? `${selectedRoute.estimated_time} ${isGu ? 'મિનિટ' : 'min'}` : ''}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {isGu ? `${selectedRoute.stops_count} સ્ટોપ્સ` : `${selectedRoute.stops_count} stops`}
                </p>

                <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('routes.firstBus')}</p>
                    <p className="font-semibold">{selectedRoute.first_bus || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('routes.lastBus')}</p>
                    <p className="font-semibold">{selectedRoute.last_bus || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('routes.frequency')}</p>
                    <p className="font-semibold">{selectedRoute.frequency || '-'}</p>
                  </div>
                </div>

                {selectedRoute.fare && (
                  <div className="mt-4 p-4 bg-accent/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">{isGu ? 'ભાડું' : 'Fare'}</p>
                    <p className="text-2xl font-bold text-accent">₹{selectedRoute.fare}</p>
                  </div>
                )}

                <div className="mt-4">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigate(`/routes/${selectedRoute.route_number}`);
                      setSelectedRoute(null);
                    }}
                  >
                    {isGu ? 'વધુ વિગતો જુઓ' : 'View Full Details'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Routes;
