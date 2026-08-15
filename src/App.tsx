import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollManager from "./components/ScrollManager";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Biens from "./pages/Biens";
import GestionLocative from "./pages/services/GestionLocative";
import GestionCopropriete from "./pages/services/GestionCopropriete";
import EstimationBiens from "./pages/services/EstimationBiens";
import AchatsVentes from "./pages/services/AchatsVentes";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import Team from "./pages/Team";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/biens" element={<Biens />} />
          <Route path="/services/gestion-locative" element={<GestionLocative />} />
          <Route path="/services/gestion-copropriete" element={<GestionCopropriete />} />
          <Route path="/services/estimation-biens" element={<EstimationBiens />} />
          <Route path="/services/achats-ventes" element={<AchatsVentes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/equipe" element={<Team />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
