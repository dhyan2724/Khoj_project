import { Bus } from 'lucide-react';
import { Bus as BusType } from '@/types/transport';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface BusTrackerCardProps {
  bus: BusType;
  routeName?: string;
}

const BusTrackerCard = ({ bus, routeName }: BusTrackerCardProps) => {
  const { language } = useLanguage();
  const isGu = language.code === 'gu';

  const getOccupancyStyles = () => {
    switch (bus.occupancy) {
      case 'low':
        return { bg: 'bg-success', text: isGu ? 'ઓછી ભીડ' : 'Low' };
      case 'medium':
        return { bg: 'bg-warning', text: isGu ? 'મધ્યમ ભીડ' : 'Medium' };
      case 'high':
        return { bg: 'bg-destructive', text: isGu ? 'વધુ ભીડ' : 'High' };
    }
  };

  const getStatusStyles = () => {
    switch (bus.status) {
      case 'running':
        return { color: 'text-success', text: isGu ? 'ચાલુ' : 'Running' };
      case 'delayed':
        return { color: 'text-warning', text: isGu ? 'મોડું' : 'Delayed' };
      case 'stopped':
        return { color: 'text-destructive', text: isGu ? 'રોકાયેલ' : 'Stopped' };
    }
  };

  const occupancy = getOccupancyStyles();
  const status = getStatusStyles();

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Bus className="h-5 w-5 text-primary animate-bus-move" />
          </div>
          <div>
            <p className="font-medium text-foreground">{bus.busNumber}</p>
            {routeName && (
              <p className="text-xs text-muted-foreground">{routeName}</p>
            )}
          </div>
        </div>
        <Badge variant="outline" className={status.color}>
          {status.text}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{isGu ? 'આગલું સ્ટોપ' : 'Next Stop'}</span>
          <span className="font-medium">{bus.nextStop}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{isGu ? 'અંદાજિત સમય' : 'ETA'}</span>
          <span className="font-medium text-accent">{bus.eta} {isGu ? 'મિનિટ' : 'min'}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{isGu ? 'ભીડ' : 'Occupancy'}</span>
          <Badge className={`${occupancy.bg} text-white`}>
            {occupancy.text}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default BusTrackerCard;
