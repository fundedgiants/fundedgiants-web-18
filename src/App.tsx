
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AffiliateTracker from "./components/AffiliateTracker";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import Checkout from "./components/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import ExchangeRate from "./pages/ExchangeRate";
import FAQ from "./pages/FAQ";
import Certificates from "./pages/Certificates";
import Billing from "./pages/Billing";
import AffiliateProgram from "./pages/AffiliateProgram";
import BecomeAffiliate from "./pages/BecomeAffiliate";
import AffiliatePortal from "./pages/AffiliatePortal";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AdminRoute from "./layouts/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import AdminAffiliates from "./pages/admin/Affiliates";
import AdminTradingAccounts from "./pages/admin/TradingAccounts";
import AdminDiscounts from "./pages/admin/Discounts";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AffiliateTracker />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/exchange-rate" element={<ExchangeRate />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/affiliate-program" element={<AffiliateProgram />} />
            <Route path="/become-affiliate" element={<BecomeAffiliate />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/affiliate-portal" element={<AffiliatePortal />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/faith" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="affiliates" element={<AdminAffiliates />} />
                <Route path="accounts" element={<AdminTradingAccounts />} />
                <Route path="discounts" element={<AdminDiscounts />} />
              </Route>
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
