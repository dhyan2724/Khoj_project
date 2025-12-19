import { useState } from 'react';
import { MessageSquare, Phone, Mail, HelpCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { busRoutes } from '@/data/transportData';
import { useLanguage } from '@/contexts/LanguageContext';

const Complaints = () => {
  const { language, t } = useLanguage();
  const isGu = language.code === 'gu';
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    busNumber: '',
    routeNumber: '',
    category: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const complaintCategories = [
    { value: 'delay', label: isGu ? 'બસ મોડી' : 'Bus Delay' },
    { value: 'behaviour', label: isGu ? 'ડ્રાઇવર/કંડક્ટર વર્તન' : 'Driver/Conductor Behavior' },
    { value: 'cleanliness', label: isGu ? 'સ્વચ્છતા' : 'Cleanliness' },
    { value: 'overcrowding', label: isGu ? 'વધુ પડતી ભીડ' : 'Overcrowding' },
    { value: 'safety', label: isGu ? 'સલામતી સમસ્યા' : 'Safety Issue' },
    { value: 'fare', label: isGu ? 'ભાડા સંબંધિત' : 'Fare Related' },
    { value: 'other', label: isGu ? 'અન્ય' : 'Other' },
  ];

  const faqs = [
    {
      question: isGu ? 'ફરિયાદ નોંધાવ્યા પછી કેટલો સમય લાગે છે?' : 'How long does it take to resolve a complaint?',
      answer: isGu 
        ? 'સામાન્ય રીતે ૭ કામકાજના દિવસોમાં ફરિયાદનો ઉકેલ આવે છે. જટિલ મુદ્દાઓ માટે વધુ સમય લાગી શકે છે.'
        : 'Usually complaints are resolved within 7 working days. Complex issues may take longer.'
    },
    {
      question: isGu ? 'હું મારી ફરિયાદની સ્થિતિ કેવી રીતે ટ્રેક કરું?' : 'How can I track my complaint status?',
      answer: isGu
        ? 'ફરિયાદ નોંધાવ્યા પછી તમને એક ટ્રેકિંગ ID મળશે. આ ID નો ઉપયોગ કરીને તમે સ્થિતિ ટ્રેક કરી શકો છો.'
        : 'After submitting a complaint, you will receive a tracking ID. Use this ID to track the status.'
    },
    {
      question: isGu ? 'ખોવાયેલી વસ્તુઓ માટે કોનો સંપર્ક કરવો?' : 'Who to contact for lost items?',
      answer: isGu
        ? 'ખોવાયેલી વસ્તુઓ માટે VMC ટ્રાન્સપોર્ટ ઓફિસ (1800-233-1333) નો સંપર્ક કરો અથવા નજીકના બસ ડેપોની મુલાકાત લો.'
        : 'For lost items, contact VMC Transport Office (1800-233-1333) or visit the nearest bus depot.'
    },
    {
      question: isGu ? 'શું હું ફરિયાદ અનામી રીતે કરી શકું?' : 'Can I file a complaint anonymously?',
      answer: isGu
        ? 'હા, નામ અને સંપર્ક માહિતી વૈકલ્પિક છે, પરંતુ ફોલો-અપ માટે સંપર્ક માહિતી આપવાની ભલામણ છે.'
        : 'Yes, name and contact information are optional, but providing contact info is recommended for follow-up.'
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description) {
      toast({
        title: isGu ? 'ભૂલ' : 'Error',
        description: isGu ? 'કૃપા કરીને જરૂરી ક્ષેત્રો ભરો' : 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: isGu ? 'ફરિયાદ નોંધાઈ' : 'Complaint Submitted',
      description: isGu ? 'તમારી ફરિયાદ સફળતાપૂર્વક નોંધાઈ ગઈ છે' : 'Your complaint has been successfully registered',
    });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      busNumber: '',
      routeNumber: '',
      category: '',
      description: '',
    });
    setIsSubmitted(false);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">{t('complaints.title')}</h1>
          <p className="text-primary-foreground/80">
            {isGu ? 'તમારી ફરિયાદ નોંધાવો અથવા પ્રતિસાદ આપો' : 'Register your complaint or provide feedback'}
          </p>
        </div>
      </section>

      <section className="container-custom py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Complaint Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  {t('complaints.submit')}
                </CardTitle>
                <CardDescription>
                  {isGu 
                    ? 'તમારી ફરિયાદની વિગતો નીચે ભરો'
                    : 'Fill in the details of your complaint below'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {isGu ? 'ફરિયાદ નોંધાઈ!' : 'Complaint Submitted!'}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {isGu 
                        ? 'તમારી ફરિયાદ સફળતાપૂર્વક નોંધાઈ ગઈ છે.'
                        : 'Your complaint has been successfully registered.'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      {isGu ? 'ટ્રેકિંગ ID:' : 'Tracking ID:'} <span className="font-mono font-semibold">VMC-{Date.now().toString().slice(-8)}</span>
                    </p>
                    <Button onClick={handleReset}>
                      {isGu ? 'નવી ફરિયાદ' : 'New Complaint'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {isGu ? 'નામ' : 'Name'} <span className="text-muted-foreground">({isGu ? 'વૈકલ્પિક' : 'optional'})</span>
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder={isGu ? 'તમારું નામ' : 'Your name'}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {isGu ? 'ફોન નંબર' : 'Phone Number'} <span className="text-muted-foreground">({isGu ? 'વૈકલ્પિક' : 'optional'})</span>
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g., 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {isGu ? 'ઇમેઇલ' : 'Email'} <span className="text-muted-foreground">({isGu ? 'વૈકલ્પિક' : 'optional'})</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="example@email.com"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t('complaints.busNumber')} <span className="text-muted-foreground">({isGu ? 'વૈકલ્પિક' : 'optional'})</span>
                        </label>
                        <Input
                          value={formData.busNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, busNumber: e.target.value }))}
                          placeholder="e.g., GJ-06-AB-1234"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {isGu ? 'રૂટ નંબર' : 'Route Number'}
                        </label>
                        <Select 
                          value={formData.routeNumber} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, routeNumber: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isGu ? 'રૂટ પસંદ કરો' : 'Select route'} />
                          </SelectTrigger>
                          <SelectContent>
                            {busRoutes.map((route) => (
                              <SelectItem key={route.id} value={route.routeNumber}>
                                {isGu ? `રૂટ ${route.routeNumber} - ${route.nameGu}` : `Route ${route.routeNumber} - ${route.name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('complaints.category')} <span className="text-destructive">*</span>
                      </label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isGu ? 'કેટેગરી પસંદ કરો' : 'Select category'} />
                        </SelectTrigger>
                        <SelectContent>
                          {complaintCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('complaints.description')} <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={isGu ? 'તમારી ફરિયાદનું વિગતવાર વર્ણન કરો...' : 'Describe your complaint in detail...'}
                        rows={5}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-accent hover:bg-accent/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                          {isGu ? 'સબમિટ થઈ રહ્યું છે...' : 'Submitting...'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {t('common.submit')}
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('complaints.helpline')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">{isGu ? 'ટોલ ફ્રી નંબર' : 'Toll Free Number'}</p>
                  <p className="text-2xl font-bold text-accent">1800-233-1333</p>
                  <p className="text-xs text-muted-foreground mt-1">24x7 {isGu ? 'ઉપલબ્ધ' : 'Available'}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+91-265-2437601</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">complaints@vmctransport.gov.in</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-info" />
                  {isGu ? 'વારંવાર પૂછાતા પ્રશ્નો' : 'FAQ'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Complaints;
