
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import ObjectDetection from "./pages/ObjectDetection";
import FitnessTracking from "./pages/FitnessTracking";
import SmartwatchPairing from "./pages/SmartwatchPairing";
import VoiceAssistantPage from "./pages/VoiceAssistantPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/object-detection" element={<ObjectDetection />} />
          <Route path="/fitness" element={<FitnessTracking />} />
          <Route path="/smartwatch" element={<SmartwatchPairing />} />
          <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
