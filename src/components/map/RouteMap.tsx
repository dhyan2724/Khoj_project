import L, { LayerGroup, Map as LeafletMap, Polyline as LeafletPolyline } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

type Stop = {
  id?: string;
  name: string;
  name_gu?: string | null;
  latitude: number;
  longitude: number;
};

interface RouteMapProps {
  stops: Stop[];
}

const RouteMap = ({ stops }: RouteMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayerRef = useRef<LeafletPolyline | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initMapIfNeeded = () => {
      if (mapRef.current || !containerRef.current || !stops.length) return;

      const map = L.map(containerRef.current, {
        center: [stops[0].latitude, stops[0].longitude],
        zoom: 13,
      });

      // Free OpenStreetMap tiles (no API key required)
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;
    };

    const drawRoute = (coords: [number, number][]) => {
      if (!mapRef.current || !coords.length) return;

      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }

      const polyline = L.polyline(coords, {
        color: '#2563eb',
        weight: 6,
        opacity: 0.95,
      }).addTo(mapRef.current);

      routeLayerRef.current = polyline;
      const bounds = polyline.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    };

    const addMarkers = () => {
      if (!mapRef.current) return;

      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      } else {
        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      stops.forEach((stop, index) => {
        const isStart = index === 0;
        const isEnd = index === stops.length - 1;

        const marker = L.circleMarker([stop.latitude, stop.longitude], {
          radius: isStart || isEnd ? 8 : 6,
          color: '#ffffff',
          weight: 2,
          fillColor: isStart || isEnd ? '#10b981' : '#2563eb',
          fillOpacity: 0.95,
        })
          .bindPopup(
            `<strong>${stop.name}</strong>${
              stop.name_gu ? `<div>${stop.name_gu}</div>` : ''
            }`
          );

        markersLayerRef.current!.addLayer(marker);
      });
    };

    const loadRoute = async () => {
      if (!stops || stops.length === 0) {
        setError('No stops available to draw a route.');
        setIsLoading(false);
        return;
      }

      initMapIfNeeded();

      if (!mapRef.current) {
        setError('Unable to create map instance.');
        setIsLoading(false);
        return;
      }

      try {
        // Simple polyline connecting stops (no external routing API)
        const coords: [number, number][] = stops.map((s) => [
          s.latitude,
          s.longitude,
        ]);
        drawRoute(coords);

        addMarkers();
        if (isMounted) setIsLoading(false);
      } catch (err) {
        console.error('Geoapify routing error, falling back to straight line', err);
        if (!mapRef.current) return;

        const coords: [number, number][] = stops.map((s) => [
          s.latitude,
          s.longitude,
        ]);
        drawRoute(coords);
        addMarkers();
        if (isMounted) {
          setError(null);
          setIsLoading(false);
        }
      }
    };

    loadRoute();

    return () => {
      isMounted = false;
    };
    }, [stops]);

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="relative h-[420px] rounded-xl overflow-hidden border border-border">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default RouteMap;

