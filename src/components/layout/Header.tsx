import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Bus, Clock, CreditCard, Globe, Info, LogIn, MapPin, Menu, MessageSquare, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Bus },
    { path: '/route-planner', label: t('nav.routePlanner'), icon: MapPin },
    { path: '/routes', label: t('nav.routes'), icon: Clock },
    // { path: '/live-tracking', label: t('nav.liveTracking'), icon: MapPin },
    { path: '/fare', label: t('nav.fare'), icon: CreditCard },
    { path: '/complaints', label: t('nav.complaints'), icon: MessageSquare },
    { path: '/about', label: t('nav.about'), icon: Info },
  ];

  const toggleLanguage = () => {
    setLanguage(language.code === 'en' 
      ? { code: 'gu', name: 'ગુજરાતી' }
      : { code: 'en', name: 'English' }
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Bus className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground leading-tight">
              {language.code === 'en' ? 'Vadodara' : 'વડોદરા'}
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              {language.code === 'en' ? 'City Bus Service' : 'સિટી બસ સેવા'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(link.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{language.code === 'en' ? 'ગુજરાતી' : 'English'}</span>
          </Button>

          {/* Auth Button */}
          {user ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/my-passes')}
              className="flex items-center gap-1.5"
            >
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">My Passes</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Bus className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold">{language.code === 'en' ? 'Vadodara' : 'વડોદરા'}</h2>
                    <p className="text-sm text-muted-foreground">
                      {language.code === 'en' ? 'City Bus Service' : 'સિટી બસ સેવા'}
                    </p>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isActive(link.path)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                  {/* Mobile Auth Link */}
                  {user ? (
                    <Link
                      to="/my-passes"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive('/my-passes')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Ticket className="h-5 w-5" />
                      My Passes
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive('/auth')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <LogIn className="h-5 w-5" />
                      Login / Register
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
