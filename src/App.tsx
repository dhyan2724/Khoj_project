import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "./pages/Home";
import RoutePlanner from "./pages/RoutePlanner";
import RoutesPage from "./pages/Routes";
// import LiveTracking from "./pages/LiveTracking";
import Fare from "./pages/Fare";
import Complaints from "./pages/Complaints";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Payment from "./pages/Payment";
import MyPasses from "./pages/MyPasses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/route-planner" element={<RoutePlanner />} />
            <Route path="/routes" element={<RoutesPage />} />
            {/* <Route path="/live-tracking" element={<LiveTracking />} /> */}
            <Route path="/fare" element={<Fare />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/my-passes" element={<MyPasses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
