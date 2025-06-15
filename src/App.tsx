
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import AffiliateTracker from "./components/AffiliateTracker";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import AuthPage from "./pages/AuthPage";
import Checkout from "./components/Checkout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./layouts/ProtectedRoute";
import AffiliatePortal from "./pages/AffiliatePortal";
import PaymentSuccess from "./pages/PaymentSuccess";
import BecomeAffiliate from "./pages/BecomeAffiliate";
import AffiliateProgram from "./pages/AffiliateProgram";
import AdminRoute from "./layouts/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/Users";
import OrdersPage from "./pages/admin/Orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <BrowserRouter>
        <AffiliateTracker />
        <Navigation />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/affiliate-program" element={<AffiliateProgram />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/become-affiliate" element={<BecomeAffiliate />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/affiliate-portal" element={<AffiliatePortal />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/faith" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
