import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
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
      <SidebarProvider defaultOpen={false}>
        <BrowserRouter>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b border-border bg-card px-4 sticky top-0 z-40">
                <SidebarTrigger className="md:hidden" />
                <div className="ml-4 flex-1">
                  <h1 className="text-lg font-semibold text-primary truncate">VRCyber Guard</h1>
                </div>
                <div className="hidden md:block">
                  <SidebarTrigger />
                </div>
              </header>
              <main className="flex-1">
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
