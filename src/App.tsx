import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GestionLocative from "./pages/services/GestionLocative";
import GestionCopropriete from "./pages/services/GestionCopropriete";
import EstimationBiens from "./pages/services/EstimationBiens";
import AchatsVentes from "./pages/services/AchatsVentes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services/gestion-locative" element={<GestionLocative />} />
          <Route path="/services/gestion-copropriete" element={<GestionCopropriete />} />
          <Route path="/services/estimation-biens" element={<EstimationBiens />} />
          <Route path="/services/achats-ventes" element={<AchatsVentes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
