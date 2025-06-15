
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Navigation from "./components/Navigation"
import { ThemeProvider } from "./contexts/theme-provider"
import { AffiliateProvider } from "./contexts/AffiliateContext" // Import the new provider
import Index from "./pages/Index"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Pricing from "./pages/Pricing"
import Contact from "./pages/Contact"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import FAQ from "./pages/FAQ"
import ProtectedRoute from "./components/ProtectedRoute"
import Footer from "./components/Footer"
import Programs from "./pages/Programs"
import ProgramDetails from "./pages/ProgramDetails"
import TradingAccount from "./pages/TradingAccount"
import Profile from "./pages/Profile"
import AffiliatePortal from "./pages/AffiliatePortal"
import BecomeAffiliate from "./pages/BecomeAffiliate"
import AffiliateProgram from "./pages/AffiliateProgram"
import CheckoutPage from "./pages/CheckoutPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Router>
          <AffiliateProvider> {/* Wrap routes with the provider */}
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/programs/:programId" element={<ProgramDetails />} />
                  <Route path="/trading-account/:id" element={<ProtectedRoute><TradingAccount /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/affiliate-portal" element={<AffiliatePortal />} />
                  <Route path="/become-affiliate" element={<BecomeAffiliate />} />
                  <Route path="/affiliate-program" element={<AffiliateProgram />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AffiliateProvider>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
