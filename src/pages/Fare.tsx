import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, CreditCard, FileText, Users, UserCheck, IndianRupee, GraduationCap, ShoppingCart, CheckCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { fareInfo, calculateFare } from '@/data/transportData';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface PassType {
  id: string;
  name: string;
  nameGu: string;
  price: number;
  duration: string;
  icon: typeof Users;
  color: string;
  benefits: string[];
  benefitsGu: string[];
}

const passTypes: PassType[] = [
  {
    id: 'general',
    name: 'General Pass',
    nameGu: 'સામાન્ય પાસ',
    price: 800,
    duration: '1 Month',
    icon: Users,
    color: 'bg-primary',
    benefits: [
      'Unlimited travel on all routes',
      'Valid for 30 days from purchase',
      'Non-transferable',
      'Online renewal available'
    ],
    benefitsGu: [
      'તમામ રૂટ પર અમર્યાદિત યાત્રા',
      'ખરીદીની તારીખથી 30 દિવસ માટે માન્ય',
      'બિન-તબદીલીપાત્ર',
      'ઓનલાઇન રિન્યુઅલ ઉપલબ્ધ'
    ]
  },
  {
    id: 'student',
    name: 'Student Pass',
    nameGu: 'વિદ્યાર્થી પાસ',
    price: 400,
    duration: '1 Month',
    icon: GraduationCap,
    color: 'bg-blue-600',
    benefits: [
      '50% discount on regular fare',
      'Valid school/college ID required',
      'Valid for academic routes',
      'Renewable every semester'
    ],
    benefitsGu: [
      'નિયમિત ભાડા પર 50% છૂટ',
      'માન્ય શાળા/કોલેજ ID જરૂરી',
      'શૈક્ષણિક રૂટ માટે માન્ય',
      'દરેક સેમેસ્ટરમાં નવીકરણ યોગ્ય'
    ]
  },
  {
    id: 'senior',
    name: 'Senior Citizen Pass',
    nameGu: 'વરિષ્ઠ નાગરિક પાસ',
    price: 500,
    duration: '1 Month',
    icon: UserCheck,
    color: 'bg-green-600',
    benefits: [
      '40% discount on regular fare',
      'Age 60+ with valid ID proof',
      'Priority seating benefits',
      'Easy renewal process'
    ],
    benefitsGu: [
      'નિયમિત ભાડા પર 40% છૂટ',
      'માન્ય ID પ્રૂફ સાથે 60+ વર્ષની ઉંમર',
      'પ્રાથમિક બેઠક લાભો',
      'સરળ નવીકરણ પ્રક્રિયા'
    ]
  }
];

const Fare = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const isGu = language.code === 'gu';
  const [distance, setDistance] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [calculatedFare, setCalculatedFare] = useState<number | null>(null);
  const [selectedPass, setSelectedPass] = useState<PassType | null>(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    idNumber: ''
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCalculate = () => {
    if (distance) {
      const fare = calculateFare(parseFloat(distance), category);
      setCalculatedFare(fare);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Student': return GraduationCap;
      case 'Senior Citizen': return UserCheck;
      case 'Monthly Pass': return CreditCard;
      default: return Users;
    }
  };

  const handleBuyPass = (pass: PassType) => {
    if (!user) {
      toast.error(isGu ? 'પાસ ખરીદવા માટે કૃપા કરીને લોગિન કરો' : 'Please login to purchase a pass');
      navigate('/auth');
      return;
    }
    setSelectedPass(pass);
    setBuyDialogOpen(true);
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error(isGu ? 'કૃપા કરીને તમામ જરૂરી ફીલ્ડ ભરો' : 'Please fill all required fields');
      return;
    }
    
    // Redirect to payment page with pass details
    setBuyDialogOpen(false);
    navigate(`/payment?type=pass&category=${selectedPass?.id}&price=${selectedPass?.price}`);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">{t('fare.title')}</h1>
          <p className="text-primary-foreground/80">
            {isGu ? 'ભાડા ની માહિતી અને બસ પાસ વિગતો' : 'Fare information and bus pass details'}
          </p>
        </div>
      </section>

      <section className="container-custom py-8">
        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">{t('fare.calculator')}</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('fare.categories')}</span>
            </TabsTrigger>
            <TabsTrigger value="pass" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">{isGu ? 'પાસ ખરીદો' : 'Buy Pass'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Fare Calculator */}
          <TabsContent value="calculator">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-accent" />
                    {t('fare.calculator')}
                  </CardTitle>
                  <CardDescription>
                    {isGu ? 'તમારી યાત્રાનું ભાડું ગણો' : 'Calculate your journey fare'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isGu ? 'અંતર (કિમી)' : 'Distance (km)'}
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g., 10"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isGu ? 'મુસાફર કેટેગરી' : 'Passenger Category'}
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fareInfo.map((info) => (
                          <SelectItem key={info.category} value={info.category}>
                            {isGu ? info.categoryGu : info.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full h-12 bg-accent hover:bg-accent/90"
                    onClick={handleCalculate}
                    disabled={!distance}
                  >
                    {isGu ? 'ભાડું ગણો' : 'Calculate Fare'}
                  </Button>
                </CardContent>
              </Card>

              {/* Result */}
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                <CardContent className="flex flex-col items-center justify-center h-full py-12">
                  {calculatedFare !== null ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                        <IndianRupee className="h-10 w-10 text-accent" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {isGu ? 'અંદાજિત ભાડું' : 'Estimated Fare'}
                      </p>
                      <p className="text-5xl font-bold text-accent mb-2">₹{calculatedFare}</p>
                      <p className="text-sm text-muted-foreground text-center">
                        {isGu 
                          ? `${distance} કિમી માટે ${category === 'General' ? 'સામાન્ય' : fareInfo.find(f => f.category === category)?.categoryGu} ભાડું`
                          : `${category} fare for ${distance} km`}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Calculator className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-center">
                        {isGu 
                          ? 'અંતર દાખલ કરો અને ભાડું ગણો'
                          : 'Enter distance and calculate fare'}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fare Categories */}
          <TabsContent value="categories">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fareInfo.map((info) => {
                const Icon = getCategoryIcon(info.category);
                return (
                  <Card key={info.category} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {isGu ? info.categoryGu : info.category}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">{info.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{isGu ? 'બેઝ ભાડું' : 'Base Fare'}</span>
                          <span className="font-medium">₹{info.baseFare}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{isGu ? 'પ્રતિ કિમી' : 'Per km'}</span>
                          <span className="font-medium">₹{info.perKm}</span>
                        </div>
                        {info.monthlyPass && (
                          <div className="flex justify-between text-sm pt-2 border-t border-border">
                            <span className="text-muted-foreground">{isGu ? 'માસિક પાસ' : 'Monthly Pass'}</span>
                            <span className="font-semibold text-accent">₹{info.monthlyPass}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Buy Pass Online */}
          <TabsContent value="pass">
            <div className="space-y-8">
              {/* Pass Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {passTypes.map((pass) => {
                  const Icon = pass.icon;
                  return (
                    <Card key={pass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className={`${pass.color} text-white pb-6`}>
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-full bg-white/20">
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                            {pass.duration}
                          </span>
                        </div>
                        <CardTitle className="text-xl mt-4">
                          {isGu ? pass.nameGu : pass.name}
                        </CardTitle>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-4xl font-bold">₹{pass.price}</span>
                          <span className="text-white/80">/{isGu ? 'મહિનો' : 'month'}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {(isGu ? pass.benefitsGu : pass.benefits).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full mt-6 bg-accent hover:bg-accent/90"
                          onClick={() => handleBuyPass(pass)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isGu ? 'હવે ખરીદો' : 'Buy Now'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Documents Required */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {t('fare.documents')}
                  </CardTitle>
                  <CardDescription>
                    {isGu 
                      ? 'પાસ માટે જરૂરી દસ્તાવેજો'
                      : 'Documents required for pass application'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fareInfo.filter(f => f.documents).map((info) => (
                      <div key={info.category} className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
                          {getCategoryIcon(info.category) && (
                            <span className="p-1.5 rounded bg-primary/10">
                              {(() => {
                                const Icon = getCategoryIcon(info.category);
                                return <Icon className="h-4 w-4 text-primary" />;
                              })()}
                            </span>
                          )}
                          {isGu ? info.categoryGu : info.category} {isGu ? 'પાસ' : 'Pass'}
                        </h4>
                        <ul className="space-y-2">
                          {info.documents?.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Buy Pass Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-accent" />
              {isGu ? 'પાસ ખરીદો' : 'Purchase Pass'}
            </DialogTitle>
            <DialogDescription>
              {selectedPass && (
                <span className="flex items-center justify-between mt-2">
                  <span>{isGu ? selectedPass.nameGu : selectedPass.name}</span>
                  <span className="font-bold text-accent text-lg">₹{selectedPass.price}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePurchaseSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">{isGu ? 'પૂરું નામ' : 'Full Name'} *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={isGu ? 'તમારું પૂરું નામ' : 'Enter your full name'}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{isGu ? 'ઇમેઇલ' : 'Email'} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{isGu ? 'ફોન નંબર' : 'Phone Number'} *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="idNumber">
                {selectedPass?.id === 'student' 
                  ? (isGu ? 'વિદ્યાર્થી ID' : 'Student ID')
                  : selectedPass?.id === 'senior'
                  ? (isGu ? 'આધાર નંબર' : 'Aadhar Number')
                  : (isGu ? 'ID નંબર' : 'ID Number')}
              </Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                placeholder={isGu ? 'ID નંબર દાખલ કરો' : 'Enter ID number'}
              />
            </div>
            <div>
              <Label htmlFor="address">{isGu ? 'સરનામું' : 'Address'}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={isGu ? 'તમારું સરનામું' : 'Enter your address'}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setBuyDialogOpen(false)}>
                {isGu ? 'રદ કરો' : 'Cancel'}
              </Button>
              <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90">
                <CreditCard className="h-4 w-4 mr-2" />
                {isGu ? 'ચુકવણી કરો' : 'Pay ₹'}{selectedPass?.price}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Fare;
