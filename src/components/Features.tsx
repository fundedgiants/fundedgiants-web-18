
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Users, Clock, Globe, Award } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Bank-level security protocols protect your trading activities and personal data with military-grade encryption."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Access comprehensive trading analytics and performance metrics to optimize your trading strategies."
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Get guidance from our team of professional traders and market analysts whenever you need assistance."
    },
    {
      icon: Clock,
      title: "24/7 Trading",
      description: "Trade around the clock with our always-available platform and never miss a market opportunity."
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access major forex pairs, commodities, and indices from markets around the world."
    },
    {
      icon: Award,
      title: "Proven Track Record",
      description: "Join thousands of successful funded traders who have achieved their financial goals with our platform."
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            🌟 Why Choose FundedGiants? 🌟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the pinnacle of prop trading with features designed for your success
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-cosmic-card border-cosmic-purple/30 shadow-cosmic hover:shadow-cosmic-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cosmic-purple to-cosmic-blue rounded-full flex items-center justify-center shadow-cosmic">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-cosmic-blue">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
