
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageCircle, Phone, MapPin, Clock, Users } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background bg-stars">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      
      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            📞 Contact the Giants 📞
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Need assistance on your divine trading journey? Our cosmic council is here to guide you through the realms of infinite possibility.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-3">
                  <MessageCircle className="h-8 w-8" />
                  Send Divine Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your divine name"
                        className="bg-background/50 border-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="bg-background/50 border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="What brings you to the giants?"
                      className="bg-background/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Share your cosmic trading vision..."
                      rows={6}
                      className="w-full px-3 py-2 bg-background/50 border border-primary/30 rounded-md focus:border-primary focus:outline-none resize-none text-foreground"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
                    ⚡ Send to the Divine Council ⚡
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Divine Email</h3>
                      <p className="text-muted-foreground">support@fundedgiants.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Support Hours</h3>
                      <p className="text-muted-foreground">24/7 Cosmic Support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Live Chat</h3>
                      <p className="text-muted-foreground">Available in dashboard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border-primary/30 shadow-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-primary mb-4">🚀 Ready to Start?</h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of traders who have ascended to divine trading status.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                    Begin Your Ascension
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
