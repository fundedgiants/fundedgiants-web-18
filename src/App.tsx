import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip"

import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ExchangeRate from './pages/ExchangeRate';
import Certificates from './pages/Certificates';
import Checkout from './components/Checkout';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import BecomeAffiliate from './pages/BecomeAffiliate';
import AffiliateProgram from './pages/AffiliateProgram';
import AffiliatePortal from './pages/AffiliatePortal';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Orders from './pages/admin/Orders';
import TradingAccounts from './pages/admin/TradingAccounts';
import Affiliates from './pages/admin/Affiliates';
import Discounts from './pages/admin/Discounts';
import PaymentSuccess from './pages/PaymentSuccess';

function App() {
  return (
    <QueryClient>
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
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/become-affiliate" element={<BecomeAffiliate />} />
              <Route path="/affiliate-program" element={<AffiliateProgram />} />
              
              {/* Protected Routes for Affiliates */}
              <Route path="/affiliate-portal" element={<ProtectedRoute><AffiliatePortal /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<Orders />} />
                <Route path="trading-accounts" element={<TradingAccounts />} />
                <Route path="affiliates" element={<Affiliates />} />
                <Route path="discounts" element={<Discounts />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClient>
  );
}

export default App;
