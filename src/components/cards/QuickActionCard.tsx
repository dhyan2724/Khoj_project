import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  color?: string;
}

const QuickActionCard = ({ icon: Icon, title, description, to, color = 'bg-primary' }: QuickActionCardProps) => {
  return (
    <Link to={to} className="group">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className={`inline-flex p-3 rounded-lg ${color} text-primary-foreground mb-4 transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full" />
      </div>
    </Link>
  );
};

export default QuickActionCard;
