import { Clock, MapPin, ArrowRight, IndianRupee } from 'lucide-react';
import { BusRoute } from '@/types/transport';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface RouteCardProps {
  route: BusRoute;
  showDetails?: boolean;
  onClick?: () => void;
}

const RouteCard = ({ route, showDetails = true, onClick }: RouteCardProps) => {
  const { language } = useLanguage();
  const isGu = language.code === 'gu';

  return (
    <div 
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {/* Route Number Badge */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className="flex items-center justify-center w-14 h-14 rounded-xl text-xl font-bold text-white"
          style={{ backgroundColor: route.color }}
        >
          {route.routeNumber}
        </div>
        <Badge variant="secondary" className="text-xs">
          {route.frequency}
        </Badge>
      </div>

      {/* Route Name */}
      <h3 className="font-semibold text-foreground mb-2">
        {isGu ? route.nameGu : route.name}
      </h3>

      {/* Start - End */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>{route.startPoint}</span>
        <ArrowRight className="h-4 w-4 flex-shrink-0" />
        <span>{route.endPoint}</span>
      </div>

      {showDetails && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{route.estimatedTime} {isGu ? 'મિનિટ' : 'min'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{route.distance} {isGu ? 'કિમી' : 'km'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span>₹{route.fare}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {route.stops.length} {isGu ? 'સ્ટોપ' : 'stops'}
          </div>
        </div>
      )}

      {/* Decorative element */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
        style={{ backgroundColor: route.color }}
      />
    </div>
  );
};

export default RouteCard;
