
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    title: "Trade with FundedGiants",
    subtitle: "Elite Prop Trading Firm",
    description: "Join the ranks of elite traders. Get funded up to $100,000 and keep up to 80% of your profits. No hidden fees, transparent rules, and instant payouts.",
    primaryCTA: "Start Trading Challenge",
    secondaryCTA: "View Programs"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to a backend
    console.log('Hero content saved:', heroContent);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {isEditing ? (
            <div className="space-y-4 p-6 bg-card rounded-lg shadow-lg">
              <input
                type="text"
                value={heroContent.title}
                onChange={(e) => setHeroContent({...heroContent, title: e.target.value})}
                className="w-full text-4xl md:text-6xl font-bold text-center bg-transparent border-b-2 border-primary focus:outline-none"
              />
              <input
                type="text"
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({...heroContent, subtitle: e.target.value})}
                className="w-full text-xl md:text-2xl text-primary text-center bg-transparent border-b border-primary/50 focus:outline-none"
              />
              <textarea
                value={heroContent.description}
                onChange={(e) => setHeroContent({...heroContent, description: e.target.value})}
                className="w-full text-lg text-muted-foreground text-center bg-transparent border border-muted resize-none focus:outline-none p-2 rounded"
                rows={3}
              />
              <div className="flex gap-4 justify-center">
                <input
                  type="text"
                  value={heroContent.primaryCTA}
                  onChange={(e) => setHeroContent({...heroContent, primaryCTA: e.target.value})}
                  className="bg-transparent border border-primary rounded px-4 py-2 focus:outline-none"
                />
                <input
                  type="text"
                  value={heroContent.secondaryCTA}
                  onChange={(e) => setHeroContent({...heroContent, secondaryCTA: e.target.value})}
                  className="bg-transparent border border-muted rounded px-4 py-2 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl text-primary font-semibold mb-4 animate-fade-in">
                  {heroContent.subtitle}
                </h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent animate-fade-in">
                  {heroContent.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
                  {heroContent.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  {heroContent.primaryCTA}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  {heroContent.secondaryCTA}
                </Button>
              </div>

              <Button 
                onClick={() => setIsEditing(true)} 
                variant="ghost" 
                size="sm"
                className="absolute top-4 right-4 opacity-50 hover:opacity-100"
              >
                Edit Hero
              </Button>
            </>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in">
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">Up to $100K Funding</h3>
                  <p className="text-sm text-muted-foreground">Trade with substantial capital</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                <Shield className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">80% Profit Split</h3>
                  <p className="text-sm text-muted-foreground">Keep majority of your profits</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
                <Zap className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-semibold">Instant Payouts</h3>
                  <p className="text-sm text-muted-foreground">Fast and reliable withdrawals</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
