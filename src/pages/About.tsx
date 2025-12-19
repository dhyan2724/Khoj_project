import { MapPin, Phone, Mail, Clock, Target, Eye, Users, Bus, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { language, t } = useLanguage();
  const isGu = language.code === 'gu';

  const stats = [
    { icon: Bus, value: '150+', label: isGu ? 'બસો' : 'Buses' },
    { icon: MapPin, value: '45+', label: isGu ? 'રૂટ' : 'Routes' },
    { icon: Users, value: '50K+', label: isGu ? 'દૈનિક મુસાફરો' : 'Daily Riders' },
    { icon: Award, value: '25+', label: isGu ? 'વર્ષોનો અનુભવ' : 'Years of Service' },
  ];

  const features = [
    {
      title: isGu ? 'સલામત મુસાફરી' : 'Safe Travel',
      description: isGu 
        ? 'CCTV કેમેરા અને GPS ટ્રેકિંગથી સજ્જ બસો'
        : 'Buses equipped with CCTV cameras and GPS tracking',
    },
    {
      title: isGu ? 'AC અને નોન-AC બસો' : 'AC & Non-AC Buses',
      description: isGu
        ? 'તમારી પસંદગી અનુસાર AC અથવા નોન-AC બસ પસંદ કરો'
        : 'Choose AC or Non-AC buses as per your preference',
    },
    {
      title: isGu ? 'ડિજિટલ ટિકિટિંગ' : 'Digital Ticketing',
      description: isGu
        ? 'UPI અને કાર્ડ પેમેન્ટ સાથે ડિજિટલ ટિકિટિંગ'
        : 'Digital ticketing with UPI and card payment',
    },
    {
      title: isGu ? 'વિશેષ સેવાઓ' : 'Special Services',
      description: isGu
        ? 'વરિષ્ઠ નાગરિકો અને વિકલાંગો માટે વિશેષ સુવિધાઓ'
        : 'Special facilities for senior citizens and differently-abled',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 mb-6">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Government Emblem"
                className="h-6 w-6"
              />
              <span className="text-sm font-medium">
                {isGu ? 'વડોદરા મ્યુનિસિપલ કોર્પોરેશન' : 'Vadodara Municipal Corporation'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('about.title')}</h1>
            <p className="text-lg text-primary-foreground/80">
              {isGu 
                ? 'વડોદરા શહેરના નાગરિકોને સલામત, વિશ્વસનીય અને પર્યાવરણ-મૈત્રીપૂર્ણ જાહેર પરિવહન સેવા પ્રદાન કરવી.'
                : 'Providing safe, reliable and eco-friendly public transportation service to the citizens of Vadodara city.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50"
              >
                <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/50 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">{t('about.mission')}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {isGu 
                    ? 'વડોદરા શહેરના નાગરિકોને કાર્યક્ષમ, સલામત અને પોષણક્ષમ જાહેર પરિવહન સેવા પ્રદાન કરવી. આધુનિક ટેકનોલોજીનો ઉપયોગ કરીને મુસાફરોના અનુભવને સુધારવો અને પર્યાવરણીય પ્રભાવ ઘટાડવો.'
                    : 'To provide efficient, safe and affordable public transportation service to the citizens of Vadodara. To improve passenger experience through modern technology and reduce environmental impact.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent text-accent-foreground">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">{t('about.vision')}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {isGu 
                    ? 'વડોદરાને ભારતની અગ્રણી સ્માર્ટ પરિવહન સિસ્ટમ ધરાવતું શહેર બનાવવું. ૨૦૩૦ સુધીમાં ૧૦૦% ઇલેક્ટ્રિક બસ ફ્લીટ અને સંપૂર્ણ ડિજિટલ ટિકિટિંગ સિસ્ટમ હાંસલ કરવી.'
                    : 'To make Vadodara a city with India\'s leading smart transportation system. To achieve 100% electric bus fleet and complete digital ticketing system by 2030.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-custom py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isGu ? 'અમારી સુવિધાઓ' : 'Our Features'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('about.contact')}</h2>
              <p className="text-primary-foreground/80 mb-6">
                {isGu 
                  ? 'કોઈપણ પ્રશ્ન અથવા સૂચન માટે અમારો સંપર્ક કરો.'
                  : 'Contact us for any queries or suggestions.'}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary-foreground/10">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{isGu ? 'સરનામું' : 'Address'}</p>
                    <p className="text-primary-foreground/70 text-sm">
                      {isGu 
                        ? 'VMC ટ્રાન્સપોર્ટ ઓફિસ, રેસ કોર્સ રોડ, વડોદરા - 390007, ગુજરાત'
                        : 'VMC Transport Office, Race Course Road, Vadodara - 390007, Gujarat'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary-foreground/10">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{isGu ? 'ફોન' : 'Phone'}</p>
                    <p className="text-primary-foreground/70 text-sm">1800-233-1333 (Toll Free)</p>
                    <p className="text-primary-foreground/70 text-sm">+91-265-2437601</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary-foreground/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{isGu ? 'ઇમેઇલ' : 'Email'}</p>
                    <p className="text-primary-foreground/70 text-sm">info@vmctransport.gov.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary-foreground/10">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{isGu ? 'ઓફિસ સમય' : 'Office Hours'}</p>
                    <p className="text-primary-foreground/70 text-sm">
                      {isGu ? 'સોમ - શુક્ર: ૧૦:૦૦ - ૧૮:૦૦' : 'Mon - Fri: 10:00 AM - 6:00 PM'}
                    </p>
                    <p className="text-primary-foreground/70 text-sm">
                      {isGu ? 'શનિ: ૧૦:૦૦ - ૧૪:૦૦' : 'Sat: 10:00 AM - 2:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-primary-foreground/10 rounded-xl h-[300px] md:h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-primary-foreground/70">
                  {isGu ? 'VMC ટ્રાન્સપોર્ટ ઓફિસ' : 'VMC Transport Office'}
                </p>
                <p className="text-xs text-primary-foreground/50">
                  {isGu ? 'રેસ કોર્સ રોડ, વડોદરા' : 'Race Course Road, Vadodara'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
