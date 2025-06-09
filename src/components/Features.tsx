
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Users, 
  Clock, 
  DollarSign,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

const Features = () => {
  const [features, setFeatures] = useState([
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced risk controls to protect both trader and firm capital with transparent rules."
    },
    {
      icon: TrendingUp,
      title: "Scalable Funding",
      description: "Start with smaller accounts and scale up to $100,000+ based on your performance."
    },
    {
      icon: Zap,
      title: "Fast Payouts",
      description: "Request withdrawals anytime with processing within 24-48 hours."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join thousands of funded traders in our exclusive Discord community."
    },
    {
      icon: Clock,
      title: "No Time Limits",
      description: "Trade at your own pace with unlimited time on most of our programs."
    },
    {
      icon: DollarSign,
      title: "Competitive Splits",
      description: "Keep up to 80% of your profits with our industry-leading profit sharing."
    },
    {
      icon: Target,
      title: "Clear Objectives",
      description: "Transparent profit targets and rules with no hidden requirements."
    },
    {
      icon: Award,
      title: "Performance Rewards",
      description: "Earn higher profit splits and account upgrades based on consistency."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your performance with detailed analytics and risk metrics."
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose FundedGiants?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to succeed as a professional trader
          </p>
          
          <Button 
            onClick={() => setIsEditing(!isEditing)} 
            variant="ghost" 
            size="sm"
            className="absolute top-0 right-0 opacity-50 hover:opacity-100"
          >
            {isEditing ? 'Save' : 'Edit Features'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/10 hover:border-primary/30">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index].title = e.target.value;
                      setFeatures(newFeatures);
                    }}
                    className="text-xl font-semibold text-center bg-transparent border-b border-primary/50 focus:outline-none"
                  />
                ) : (
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent className="text-center">
                {isEditing ? (
                  <textarea
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index].description = e.target.value;
                      setFeatures(newFeatures);
                    }}
                    className="w-full text-muted-foreground bg-transparent border border-muted rounded p-2 resize-none focus:outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{feature.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
