import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, CheckCircle, User, Calendar, IndianRupee, Ticket, Bus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Payment = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  
  const type = searchParams.get("type") || "pass";
  const category = searchParams.get("category") || "general";
  const price = parseInt(searchParams.get("price") || "800");
  const routeNumber = searchParams.get("route") || "";
  const fromStop = searchParams.get("from") || "";
  const toStop = searchParams.get("to") || "";

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        toast({
          title: "Login Required",
          description: "Please login to make a payment.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "student": return "Student";
      case "senior": return "Senior Citizen";
      default: return "General";
    }
  };

  const getValidUntil = () => {
    const date = new Date();
    if (type === "pass") {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setHours(date.getHours() + 24);
    }
    return date;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv) {
      toast({
        title: "Invalid Details",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create purchase record
    const { data, error } = await supabase
      .from("purchases")
      .insert({
        user_id: user.id,
        type: type as "ticket" | "pass",
        category: category as "general" | "student" | "senior",
        price,
        valid_until: getValidUntil().toISOString(),
        route_number: routeNumber || null,
        from_stop: fromStop || null,
        to_stop: toStop || null,
        status: "active",
        payment_status: "completed",
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPurchaseId(data.id);
      setShowSuccess(true);
    }
    setLoading(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/my-passes");
  };

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>Complete your purchase securely</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  {type === "pass" ? <Ticket className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{type === "pass" ? "Monthly Pass" : "Single Ticket"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{getCategoryLabel(category)}</span>
                  </div>
                  {routeNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">{routeNumber}</span>
                    </div>
                  )}
                  {fromStop && toStop && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Journey:</span>
                      <span className="font-medium">{fromStop} → {toStop}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span className="font-medium">{getValidUntil().toLocaleDateString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary flex items-center">
                      <IndianRupee className="w-4 h-4" />{price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    maxLength={19}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="Name on card"
                    value={cardData.cardName}
                    onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>Processing Payment...</>
                    ) : (
                      <>
                        <IndianRupee className="w-4 h-4 mr-2" />
                        Pay ₹{price}
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your {type === "pass" ? "monthly pass" : "ticket"} has been purchased successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono">{purchaseId?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-semibold">₹{price}</span>
            </div>
            <div className="flex justify-between">
              <span>Valid Until:</span>
              <span>{getValidUntil().toLocaleDateString()}</span>
            </div>
          </div>
          <Button onClick={handleSuccessClose} className="w-full">
            View My Passes
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Payment;
