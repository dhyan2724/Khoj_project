import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { ServiceAlert } from '@/types/transport';
import { useLanguage } from '@/contexts/LanguageContext';

interface AlertCardProps {
  alert: ServiceAlert;
}

const AlertCard = ({ alert }: AlertCardProps) => {
  const { language } = useLanguage();
  const isGu = language.code === 'gu';

  const getAlertStyles = () => {
    switch (alert.type) {
      case 'warning':
        return {
          bg: 'bg-warning/10 border-warning/20',
          icon: AlertTriangle,
          iconColor: 'text-warning',
        };
      case 'disruption':
        return {
          bg: 'bg-destructive/10 border-destructive/20',
          icon: AlertCircle,
          iconColor: 'text-destructive',
        };
      default:
        return {
          bg: 'bg-info/10 border-info/20',
          icon: Info,
          iconColor: 'text-info',
        };
    }
  };

  const styles = getAlertStyles();
  const Icon = styles.icon;

  return (
    <div className={`rounded-lg border p-4 ${styles.bg}`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-1">
            {isGu ? alert.titleGu : alert.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isGu ? alert.descriptionGu : alert.description}
          </p>
          {alert.affectedRoutes && alert.affectedRoutes.length > 0 && (
            <div className="mt-2 flex gap-1 flex-wrap">
              {alert.affectedRoutes.map((route) => (
                <span 
                  key={route}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-foreground/10 text-foreground"
                >
                  {isGu ? 'રૂટ' : 'Route'} {route}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
