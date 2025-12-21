import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RouteDetail from "./pages/RouteDetail";
import RoutePlanner from "./pages/RoutePlanner";
import RoutesPage from "./pages/Routes";
// import LiveTracking from "./pages/LiveTracking";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Complaints from "./pages/Complaints";
import Fare from "./pages/Fare";
import MyPasses from "./pages/MyPasses";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";

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
            <Route path="/routes/:routeNumber" element={<RouteDetail />} />
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
