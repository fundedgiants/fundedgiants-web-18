
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Logout failed: ${error.message}`);
    } else {
      toast.success('You have been logged out.');
      navigate('/');
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/#programs' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <span className="text-xl font-bold text-primary">FundedGiants</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth & CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {session ? (
              <Button onClick={handleLogout} variant="ghost" className="text-primary hover:bg-primary/10">
                Logout
              </Button>
            ) : (
              <Button asChild variant="ghost" className="text-primary hover:bg-primary/10">
                <Link to="/auth">Register/Login</Link>
              </Button>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/checkout">Get Funded</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:text-primary"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-primary/20">
                {session ? (
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-primary hover:bg-primary/10">
                    Logout
                  </Button>
                ) : (
                  <Button asChild variant="ghost" className="w-full justify-start text-primary hover:bg-primary/10">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>Register/Login</Link>
                  </Button>
                )}
                <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link to="/checkout" onClick={() => setIsOpen(false)}>Get Funded</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
