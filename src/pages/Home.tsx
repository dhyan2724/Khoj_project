import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bus, MapPin, Clock, CreditCard, MessageSquare, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import QuickActionCard from '@/components/cards/QuickActionCard';
import AlertCard from '@/components/cards/AlertCard';
import RouteCard from '@/components/cards/RouteCard';
import { busStops, busRoutes, serviceAlerts } from '@/data/transportData';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const { language, t } = useLanguage();
  const isGu = language.code === 'gu';
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');

  const quickActions = [
    {
      icon: Bus,
      title: isGu ? 'બસ શોધો' : 'Find Bus',
      description: isGu ? 'તમારા સ્ટોપથી બસ શોધો' : 'Find buses from your stop',
      to: '/route-planner',
      color: 'bg-primary',
    },
    {
      icon: Clock,
      title: isGu ? 'રૂટ અને સમયપત્રક' : 'Routes & Timetable',
      description: isGu ? 'તમામ રૂટ અને સમય જુઓ' : 'View all routes and timings',
      to: '/routes',
      color: 'bg-info',
    },
    {
      icon: CreditCard,
      title: isGu ? 'ભાડું અને પાસ' : 'Fare & Pass',
      description: isGu ? 'ભાડું અને પાસની માહિતી' : 'Fare and pass information',
      to: '/fare',
      color: 'bg-success',
    },
    {
      icon: MessageSquare,
      title: isGu ? 'ફરિયાદ' : 'Complaints',
      description: isGu ? 'ફરિયાદ નોંધાવો' : 'Register a complaint',
      to: '/complaints',
      color: 'bg-accent',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRIMjR2LTJoMTJ2MnptMC00SDI0di0yaDEydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container-custom relative z-10 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            {/* Government Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Government Emblem"
                className="h-6 w-6"
              />
              <span className="text-sm font-medium">
                {isGu ? 'વડોદરા મ્યુનિસિપલ કોર્પોરેશન' : 'Vadodara Municipal Corporation'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              {t('home.title')}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              {t('home.subtitle')}
            </p>

            {/* Search Box */}
            <div className="bg-card/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-xl max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Select value={fromStop} onValueChange={setFromStop}>
                    <SelectTrigger className="pl-10 h-12 text-foreground">
                      <SelectValue placeholder={isGu ? 'ક્યાંથી' : 'From'} />
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
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
                  <Select value={toStop} onValueChange={setToStop}>
                    <SelectTrigger className="pl-10 h-12 text-foreground">
                      <SelectValue placeholder={isGu ? 'ક્યાં' : 'To'} />
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
                <Link 
                  to={`/route-planner?from=${fromStop}&to=${toStop}`}
                  className="w-full md:w-auto"
                >
                  <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    <Search className="h-5 w-5 mr-2" />
                    {t('home.findBus')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container-custom py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">{t('home.quickLinks')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div 
              key={action.to}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <QuickActionCard {...action} />
            </div>
          ))}
        </div>
      </section>

      {/* Service Alerts */}
      {serviceAlerts.length > 0 && (
        <section className="container-custom pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t('home.serviceAlerts')}</h2>
          </div>
          <div className="space-y-3">
            {serviceAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Routes */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {isGu ? 'લોકપ્રિય રૂટ' : 'Popular Routes'}
            </h2>
            <Link to="/routes">
              <Button variant="ghost" className="group">
                {isGu ? 'બધા રૂટ જુઓ' : 'View All Routes'}
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {busRoutes.slice(0, 3).map((route, index) => (
              <div 
                key={route.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link to={`/routes?route=${route.id}`}>
                  <RouteCard route={route} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '150+', label: isGu ? 'બસો' : 'Buses' },
            { number: '45+', label: isGu ? 'રૂટ' : 'Routes' },
            { number: '200+', label: isGu ? 'સ્ટોપ' : 'Stops' },
            { number: '50K+', label: isGu ? 'દૈનિક મુસાફરો' : 'Daily Riders' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.number}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isGu ? 'તમારી બસ લાઇવ ટ્રેક કરો' : 'Track Your Bus Live'}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {isGu 
              ? 'રીઅલ-ટાઇમમાં તમારી બસની સ્થિતિ જાણો. ETA અને ભીડની માહિતી મેળવો.'
              : 'Know your bus location in real-time. Get ETA and occupancy information.'}
          </p>
          {/* <Link to="/live-tracking">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              {isGu ? 'લાઇવ ટ્રેકિંગ શરૂ કરો' : 'Start Live Tracking'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link> */}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
