import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/types/transport';

interface Translations {
  [key: string]: {
    en: string;
    gu: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', gu: 'હોમ' },
  'nav.routePlanner': { en: 'Route Planner', gu: 'રૂટ પ્લાનર' },
  'nav.routes': { en: 'Routes & Timetable', gu: 'રૂટ અને સમયપત્રક' },
  'nav.liveTracking': { en: 'Live Tracking', gu: 'લાઇવ ટ્રેકિંગ' },
  'nav.fare': { en: 'Fare & Pass', gu: 'ભાડું અને પાસ' },
  'nav.complaints': { en: 'Complaints', gu: 'ફરિયાદ' },
  'nav.about': { en: 'About Us', gu: 'અમારા વિશે' },
  
  // Home Page
  'home.title': { en: 'Vadodara City Bus Service', gu: 'વડોદરા સિટી બસ સેવા' },
  'home.subtitle': { en: 'Your reliable public transport partner', gu: 'તમારો વિશ્વસનીય જાહેર પરિવહન ભાગીદાર' },
  'home.searchPlaceholder': { en: 'Where do you want to go?', gu: 'તમે ક્યાં જવા માંગો છો?' },
  'home.findBus': { en: 'Find Bus', gu: 'બસ શોધો' },
  'home.quickLinks': { en: 'Quick Links', gu: 'ઝડપી લિંક્સ' },
  'home.serviceAlerts': { en: 'Service Alerts', gu: 'સેવા ચેતવણીઓ' },
  
  // Route Planner
  'planner.title': { en: 'Plan Your Journey', gu: 'તમારી યાત્રા પ્લાન કરો' },
  'planner.from': { en: 'From', gu: 'ક્યાંથી' },
  'planner.to': { en: 'To', gu: 'ક્યાં' },
  'planner.selectStop': { en: 'Select stop', gu: 'સ્ટોપ પસંદ કરો' },
  'planner.search': { en: 'Search Routes', gu: 'રૂટ શોધો' },
  'planner.results': { en: 'Available Routes', gu: 'ઉપલબ્ધ રૂટ' },
  'planner.noResults': { en: 'No direct routes found', gu: 'કોઈ સીધો રૂટ મળ્યો નથી' },
  
  // Routes
  'routes.title': { en: 'All Bus Routes', gu: 'તમામ બસ રૂટ' },
  'routes.routeNumber': { en: 'Route', gu: 'રૂટ' },
  'routes.stops': { en: 'Stops', gu: 'સ્ટોપ' },
  'routes.firstBus': { en: 'First Bus', gu: 'પહેલી બસ' },
  'routes.lastBus': { en: 'Last Bus', gu: 'છેલ્લી બસ' },
  'routes.frequency': { en: 'Frequency', gu: 'આવર્તન' },
  'routes.download': { en: 'Download Timetable', gu: 'સમયપત્રક ડાઉનલોડ કરો' },
  
  // Live Tracking
  'tracking.title': { en: 'Live Bus Tracking', gu: 'લાઇવ બસ ટ્રેકિંગ' },
  'tracking.selectRoute': { en: 'Select Route', gu: 'રૂટ પસંદ કરો' },
  'tracking.eta': { en: 'ETA', gu: 'અંદાજિત સમય' },
  'tracking.nextStop': { en: 'Next Stop', gu: 'આગલું સ્ટોપ' },
  'tracking.occupancy': { en: 'Occupancy', gu: 'ભીડ' },
  
  // Fare
  'fare.title': { en: 'Fare & Bus Pass', gu: 'ભાડું અને બસ પાસ' },
  'fare.calculator': { en: 'Fare Calculator', gu: 'ભાડું કેલ્ક્યુલેટર' },
  'fare.categories': { en: 'Fare Categories', gu: 'ભાડા કેટેગરી' },
  'fare.monthlyPass': { en: 'Monthly Pass', gu: 'માસિક પાસ' },
  'fare.documents': { en: 'Required Documents', gu: 'જરૂરી દસ્તાવેજો' },
  
  // Complaints
  'complaints.title': { en: 'Complaints & Feedback', gu: 'ફરિયાદ અને પ્રતિસાદ' },
  'complaints.submit': { en: 'Submit Complaint', gu: 'ફરિયાદ સબમિટ કરો' },
  'complaints.busNumber': { en: 'Bus Number', gu: 'બસ નંબર' },
  'complaints.category': { en: 'Category', gu: 'કેટેગરી' },
  'complaints.description': { en: 'Description', gu: 'વર્ણન' },
  'complaints.helpline': { en: 'Helpline', gu: 'હેલ્પલાઇન' },
  
  // About
  'about.title': { en: 'About Vadodara City Transport', gu: 'વડોદરા સિટી ટ્રાન્સપોર્ટ વિશે' },
  'about.mission': { en: 'Our Mission', gu: 'અમારું મિશન' },
  'about.vision': { en: 'Our Vision', gu: 'અમારું વિઝન' },
  'about.contact': { en: 'Contact Us', gu: 'સંપર્ક કરો' },
  
  // Common
  'common.minutes': { en: 'min', gu: 'મિનિટ' },
  'common.km': { en: 'km', gu: 'કિમી' },
  'common.rupees': { en: '₹', gu: '₹' },
  'common.search': { en: 'Search', gu: 'શોધો' },
  'common.submit': { en: 'Submit', gu: 'સબમિટ' },
  'common.cancel': { en: 'Cancel', gu: 'રદ કરો' },
  'common.viewDetails': { en: 'View Details', gu: 'વિગતો જુઓ' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>({ code: 'en', name: 'English' });

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language.code] || translation.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
