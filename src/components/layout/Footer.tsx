import { Link } from 'react-router-dom';
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  const isGu = language.code === 'gu';

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-foreground/10">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{isGu ? 'વડોદરા' : 'Vadodara'}</h3>
                <p className="text-sm text-primary-foreground/70">{isGu ? 'સિટી બસ સેવા' : 'City Bus Service'}</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {isGu 
                ? 'વડોદરા મ્યુનિસિપલ કોર્પોરેશન દ્વારા સંચાલિત, નાગરિકોને સલામત અને વિશ્વસનીય જાહેર પરિવહન પ્રદાન કરવું.'
                : 'Operated by Vadodara Municipal Corporation, providing safe and reliable public transport to citizens.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{isGu ? 'ઝડપી લિંક્સ' : 'Quick Links'}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/routes" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {isGu ? 'રૂટ અને સમયપત્રક' : 'Routes & Timetable'}
                </Link>
              </li>
              <li>
                <Link to="/fare" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {isGu ? 'ભાડું અને પાસ' : 'Fare & Pass'}
                </Link>
              </li>
              {/* <li>
                <Link to="/live-tracking" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {isGu ? 'લાઇવ ટ્રેકિંગ' : 'Live Tracking'}
                </Link>
              </li> */}
              <li>
                <Link to="/complaints" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {isGu ? 'ફરિયાદ' : 'Complaints'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{isGu ? 'સંપર્ક' : 'Contact'}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>1800-233-1333 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>info@vmctransport.gov.in</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {isGu 
                    ? 'VMC ટ્રાન્સપોર્ટ ઓફિસ, રેસ કોર્સ રોડ, વડોદરા - 390007'
                    : 'VMC Transport Office, Race Course Road, Vadodara - 390007'}
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Gov */}
          <div>
            <h4 className="font-semibold mb-4">{isGu ? 'અમને ફોલો કરો' : 'Follow Us'}</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="text-xs text-primary-foreground/50">
              <p>{isGu ? 'ગુજરાત સરકાર' : 'Government of Gujarat'}</p>
              <p>{isGu ? 'વડોદરા મ્યુનિસિપલ કોર્પોરેશન' : 'Vadodara Municipal Corporation'}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 {isGu ? 'વડોદરા સિટી બસ સેવા. સર્વ હક્ક સુરક્ષિત.' : 'Vadodara City Bus Service. All rights reserved.'}
          </p>
          <div className="flex gap-4 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-primary-foreground transition-colors">{isGu ? 'ગોપનીયતા નીતિ' : 'Privacy Policy'}</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">{isGu ? 'નિયમો અને શરતો' : 'Terms of Service'}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
