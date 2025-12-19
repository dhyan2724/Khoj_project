import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ticket, Bus, Calendar, Clock, QrCode, User, LogOut, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Purchase {
  id: string;
  type: string;
  category: string;
  price: number;
  valid_from: string;
  valid_until: string;
  route_number: string | null;
  from_stop: string | null;
  to_stop: string | null;
  status: string;
  payment_status: string;
  created_at: string;
}

const MyPasses = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<Purchase | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
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
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("payment_status", "completed")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your passes.",
        variant: "destructive",
      });
    } else {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "student": return "Student";
      case "senior": return "Senior Citizen";
      default: return "General";
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "student": return "bg-blue-500";
      case "senior": return "bg-purple-500";
      default: return "bg-primary";
    }
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const getStatusBadge = (purchase: Purchase) => {
    if (isExpired(purchase.valid_until)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
  };

  const activePasses = purchases.filter(p => p.type === "pass" && !isExpired(p.valid_until));
  const activeTickets = purchases.filter(p => p.type === "ticket" && !isExpired(p.valid_until));
  const expiredPurchases = purchases.filter(p => isExpired(p.valid_until));

  const PassCard = ({ purchase }: { purchase: Purchase }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedPass(purchase)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 ${getCategoryColor(purchase.category)} rounded-lg flex items-center justify-center`}>
              {purchase.type === "pass" ? (
                <Ticket className="w-6 h-6 text-white" />
              ) : (
                <Bus className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">
                {purchase.type === "pass" ? "Monthly Pass" : "Single Ticket"}
              </h3>
              <p className="text-sm text-muted-foreground">{getCategoryLabel(purchase.category)}</p>
              {purchase.route_number && (
                <p className="text-sm text-muted-foreground">Route: {purchase.route_number}</p>
              )}
            </div>
          </div>
          {getStatusBadge(purchase)}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Valid till: {new Date(purchase.valid_until).toLocaleDateString()}</span>
          </div>
          <span className="font-semibold flex items-center">
            <IndianRupee className="w-3 h-3" />{purchase.price}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="min-h-[80vh] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Passes & Tickets</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Buy Monthly Pass</h3>
                    <p className="text-sm opacity-90">Unlimited travel for a month</p>
                  </div>
                  <Button variant="secondary" onClick={() => navigate("/fare")}>
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Buy Single Ticket</h3>
                    <p className="text-sm text-muted-foreground">For one-time journey</p>
                  </div>
                  <Button onClick={() => navigate("/route-planner")}>
                    Plan Journey
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Passes & Tickets Tabs */}
          <Tabs defaultValue="passes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="passes">
                Active Passes ({activePasses.length})
              </TabsTrigger>
              <TabsTrigger value="tickets">
                Active Tickets ({activeTickets.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                History ({expiredPurchases.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="passes" className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : activePasses.length > 0 ? (
                <div className="grid gap-4">
                  {activePasses.map((pass) => (
                    <PassCard key={pass.id} purchase={pass} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Active Passes</h3>
                    <p className="text-muted-foreground mb-4">You don't have any active monthly passes.</p>
                    <Button onClick={() => navigate("/fare")}>Buy a Pass</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tickets" className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : activeTickets.length > 0 ? (
                <div className="grid gap-4">
                  {activeTickets.map((ticket) => (
                    <PassCard key={ticket.id} purchase={ticket} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No Active Tickets</h3>
                    <p className="text-muted-foreground mb-4">You don't have any active tickets.</p>
                    <Button onClick={() => navigate("/route-planner")}>Book a Ticket</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : expiredPurchases.length > 0 ? (
                <div className="grid gap-4">
                  {expiredPurchases.map((purchase) => (
                    <PassCard key={purchase.id} purchase={purchase} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No History</h3>
                    <p className="text-muted-foreground">Your expired passes and tickets will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Pass Detail Dialog */}
      <Dialog open={!!selectedPass} onOpenChange={() => setSelectedPass(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPass?.type === "pass" ? (
                <Ticket className="w-5 h-5" />
              ) : (
                <Bus className="w-5 h-5" />
              )}
              {selectedPass?.type === "pass" ? "Monthly Pass" : "Single Ticket"}
            </DialogTitle>
          </DialogHeader>
          {selectedPass && (
            <div className="space-y-4">
              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Scan to verify</p>
                  </div>
                </div>
              </div>

              {/* Pass Details */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pass ID:</span>
                  <span className="font-mono font-semibold">{selectedPass.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold">{getCategoryLabel(selectedPass.category)}</span>
                </div>
                {selectedPass.route_number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route:</span>
                    <span className="font-semibold">{selectedPass.route_number}</span>
                  </div>
                )}
                {selectedPass.from_stop && selectedPass.to_stop && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Journey:</span>
                    <span className="font-semibold">{selectedPass.from_stop} → {selectedPass.to_stop}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid From:</span>
                  <span className="font-semibold">{new Date(selectedPass.valid_from).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span className="font-semibold">{new Date(selectedPass.valid_until).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedPass)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span className="font-semibold flex items-center">
                    <IndianRupee className="w-3 h-3" />{selectedPass.price}
                  </span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Show this pass to the conductor while boarding the bus
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MyPasses;
