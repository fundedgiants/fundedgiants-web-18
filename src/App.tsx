import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip"

import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ExchangeRate from './pages/ExchangeRate';
import Certificates from './pages/Certificates';
import Checkout from './components/Checkout';
import NotFound from './pages/NotFound';
import BecomeAffiliate from './pages/BecomeAffiliate';
import AffiliateProgram from './pages/AffiliateProgram';
import PaymentSuccess from './pages/PaymentSuccess';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/exchange-rate" element={<ExchangeRate />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/become-affiliate" element={<BecomeAffiliate />} />
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
