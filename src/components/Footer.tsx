
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Twitter, 
  Youtube, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Phone,
  TrendingUp
} from 'lucide-react';

const Footer = () => {
  const [footerContent, setFooterContent] = useState({
    description: "FundedGiants is a leading proprietary trading firm providing capital to skilled traders worldwide. Join our community of successful traders and scale your trading career.",
    contact: {
      email: "support@fundedgiants.com",
      phone: "+1 (555) 123-4567",
      address: "123 Trading Street, Financial District, NY 10001"
    },
    social: {
      twitter: "#",
      youtube: "#",
      discord: "#"
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const quickLinks = [
    "About Us", "Trading Programs", "Rules & FAQ", "Contact Support", "Community", "Blog"
  ];

  const programs = [
    "Phoenix Rise", "Rhino Rush", "Bull Charge", "Account Scaling", "Risk Management"
  ];

  return (
    <footer className="bg-gradient-to-b from-secondary/5 to-primary/10 border-t border-primary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 relative">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">FundedGiants</span>
            </div>
            
            {isEditing ? (
              <textarea
                value={footerContent.description}
                onChange={(e) => setFooterContent({
                  ...footerContent,
                  description: e.target.value
                })}
                className="w-full bg-transparent border border-muted rounded p-2 resize-none focus:outline-none"
                rows={4}
              />
            ) : (
              <p className="text-muted-foreground mb-6 max-w-md">
                {footerContent.description}
              </p>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                {isEditing ? (
                  <input
                    type="email"
                    value={footerContent.contact.email}
                    onChange={(e) => setFooterContent({
                      ...footerContent,
                      contact: { ...footerContent.contact, email: e.target.value }
                    })}
                    className="bg-transparent border-b border-muted focus:outline-none"
                  />
                ) : (
                  <span className="text-muted-foreground">{footerContent.contact.email}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={footerContent.contact.phone}
                    onChange={(e) => setFooterContent({
                      ...footerContent,
                      contact: { ...footerContent.contact, phone: e.target.value }
                    })}
                    className="bg-transparent border-b border-muted focus:outline-none"
                  />
                ) : (
                  <span className="text-muted-foreground">{footerContent.contact.phone}</span>
                )}
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                {isEditing ? (
                  <input
                    type="text"
                    value={footerContent.contact.address}
                    onChange={(e) => setFooterContent({
                      ...footerContent,
                      contact: { ...footerContent.contact, address: e.target.value }
                    })}
                    className="bg-transparent border-b border-muted focus:outline-none"
                  />
                ) : (
                  <span className="text-muted-foreground">{footerContent.contact.address}</span>
                )}
              </div>
            </div>

            <Button 
              onClick={() => setIsEditing(!isEditing)} 
              variant="ghost" 
              size="sm"
              className="absolute top-0 right-0 opacity-50 hover:opacity-100"
            >
              {isEditing ? 'Save' : 'Edit Footer'}
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold mb-6">Trading Programs</h4>
            <ul className="space-y-3">
              {programs.map((program, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {program}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 FundedGiants. All rights reserved. Trading involves risk and may not be suitable for all investors.
          </p>
          
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-primary">
              <Youtube className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-primary">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
