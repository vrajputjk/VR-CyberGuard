import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IPLookup from "./pages/IPLookup";
import Encryption from "./pages/Encryption";
import PhishingDetector from "./pages/PhishingDetector";
import NetworkScanner from "./pages/NetworkScanner";
import DNSLookup from "./pages/DNSLookup";
import BreachChecker from "./pages/BreachChecker";
import EmailSecurity from "./pages/EmailSecurity";
import LinkObfuscator from "./pages/LinkObfuscator";
import Steganography from "./pages/Steganography";
import Hasher from "./pages/Hasher";
import Dirb from "./pages/Dirb";
import Nikto from "./pages/Nikto";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ip-lookup" element={<IPLookup />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/phishing-detector" element={<PhishingDetector />} />
          <Route path="/network-scanner" element={<NetworkScanner />} />
          <Route path="/dns-lookup" element={<DNSLookup />} />
          <Route path="/breach-checker" element={<BreachChecker />} />
          <Route path="/email-security" element={<EmailSecurity />} />
          <Route path="/link-obfuscator" element={<LinkObfuscator />} />
          <Route path="/steganography" element={<Steganography />} />
          <Route path="/hasher" element={<Hasher />} />
          <Route path="/dirb" element={<Dirb />} />
          <Route path="/nikto" element={<Nikto />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
