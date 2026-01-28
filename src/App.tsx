import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScreenReaderProvider } from "@/components/accessibility/ScreenReaderProvider";
import { AccessibilityProvider } from "@/components/providers/AccessibilityProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PatientHistory from "./pages/PatientHistory";
import PatientDetail from "./pages/PatientDetail";
import AuditTrail from "./pages/AuditTrail";
import DoctorProfile from "./pages/DoctorProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <TooltipProvider>
        <ScreenReaderProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patient-history" element={<PatientHistory />} />
              <Route path="/patient-detail" element={<PatientDetail />} />
              <Route path="/audit-trail" element={<AuditTrail />} />
              <Route path="/profile" element={<DoctorProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ScreenReaderProvider>
      </TooltipProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
