import { useState } from 'react';
import { Search, Download, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { busRoutes } from '@/data/transportData';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BusRoute } from '@/types/transport';

const Routes = () => {
  const { language, t } = useLanguage();
  const isGu = language.code === 'gu';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);

  const filteredRoutes = busRoutes.filter((route) => {
    const search = searchTerm.toLowerCase();
    return (
      route.routeNumber.toLowerCase().includes(search) ||
      route.name.toLowerCase().includes(search) ||
      route.nameGu.includes(search) ||
      route.startPoint.toLowerCase().includes(search) ||
      route.endPoint.toLowerCase().includes(search)
    );
  });

  const handleDownload = () => {
    // Simulate timetable download
    const timetableData = busRoutes.map(route => ({
      route: route.routeNumber,
      name: route.name,
      firstBus: route.firstBus,
      lastBus: route.lastBus,
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
                {filteredRoutes.map((route, index) => (
                  <tr 
                    key={route.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedRoute(route)}
                  >
                    <td className="p-4">
                      <div 
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: route.color }}
                      >
                        {route.routeNumber}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{isGu ? route.nameGu : route.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {route.startPoint} <ArrowRight className="h-3 w-3" /> {route.endPoint}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant="secondary">{route.stops.length} {isGu ? 'સ્ટોપ' : 'stops'}</Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-foreground">{route.firstBus}</td>
                    <td className="p-4 hidden lg:table-cell text-foreground">{route.lastBus}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {route.frequency}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        {t('common.viewDetails')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
                    style={{ backgroundColor: selectedRoute.color }}
                  >
                    {selectedRoute.routeNumber}
                  </div>
                  <div>
                    <p className="text-lg">{isGu ? selectedRoute.nameGu : selectedRoute.name}</p>
                    <p className="text-sm text-muted-foreground font-normal">
                      {selectedRoute.distance} km • {selectedRoute.estimatedTime} {isGu ? 'મિનિટ' : 'min'}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-3">{isGu ? 'સ્ટોપ' : 'Stops'}</h4>
                <div className="space-y-0 max-h-[300px] overflow-y-auto">
                  {selectedRoute.stops.map((stop, index) => {
                    const isLast = index === selectedRoute.stops.length - 1;
                    return (
                      <div key={stop.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-3 h-3 rounded-full border-2 ${
                              index === 0 || isLast
                                ? 'bg-accent border-accent' 
                                : 'bg-card border-muted-foreground'
                            }`}
                          />
                          {!isLast && (
                            <div className="w-0.5 h-6 bg-border" />
                          )}
                        </div>
                        <p className={`text-sm pb-2 ${index === 0 || isLast ? 'font-medium' : 'text-muted-foreground'}`}>
                          {isGu ? stop.nameGu : stop.name}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('routes.firstBus')}</p>
                    <p className="font-semibold">{selectedRoute.firstBus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('routes.lastBus')}</p>
                    <p className="font-semibold">{selectedRoute.lastBus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('routes.frequency')}</p>
                    <p className="font-semibold">{selectedRoute.frequency}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{isGu ? 'ભાડું' : 'Fare'}</p>
                  <p className="text-2xl font-bold text-accent">₹{selectedRoute.fare}</p>
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
