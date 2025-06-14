
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Crown, Sword } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Olympus', path: '/' },
    { name: 'Divine Lore', path: '/about' },
    { name: 'War Programs', path: '/#programs' },
    { name: 'Sacred Wisdom', path: '/faq' },
    { name: 'Divine Council', path: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-primary/30 shadow-lg">
      <div className="absolute inset-0 bg-war-gradient opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Divine Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <Crown className="h-10 w-10 text-primary group-hover:scale-110 transition-transform animate-lightning-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            </div>
            <span className="text-2xl font-bold text-primary cinzel-font text-divine-glow group-hover:scale-105 transition-transform">
              FUNDEDGIANTS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-foreground hover:text-primary transition-all duration-300 font-semibold text-lg cinzel-font relative group"
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
          </div>

          {/* Divine Auth & CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Button variant="ghost" className="text-primary hover:bg-primary/10 font-bold cinzel-font text-lg border border-primary/30 hover:border-primary/60 transition-all">
              ⚔️ ENTER REALM
            </Button>
            <Button className="btn-divine px-8 py-3 text-lg font-bold cinzel-font shadow-xl">
              🏛️ GET DIVINE POWER
            </Button>
          </div>

          {/* Mobile Divine Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-all"
          >
            {isOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <div className="relative">
                <Menu className="h-8 w-8" />
                <Sword className="h-4 w-4 absolute -top-1 -right-1 text-primary" />
              </div>
            )}
          </button>
        </div>

        {/* Mobile Divine Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-primary/30">
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-foreground hover:text-primary transition-colors font-semibold py-3 cinzel-font text-lg relative group"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></div>
                </Link>
              ))}
              <div className="flex flex-col space-y-4 pt-6 border-t border-primary/30">
                <Button variant="ghost" className="w-full justify-start text-primary hover:bg-primary/10 font-bold cinzel-font border border-primary/30">
                  ⚔️ ENTER REALM
                </Button>
                <Button className="w-full justify-start btn-divine font-bold cinzel-font">
                  🏛️ GET DIVINE POWER
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
