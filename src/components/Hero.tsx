
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  const [heroContent, setHeroContent] = useState({
    title: "Trade with FundedGiants",
    subtitle: "Elite Mythic Trading Realm",
    description: "Ascend to the pantheon of elite traders. Harness the power of the giants with funding up to $200,000 and scale up to $1,000,000. Keep up to 70% of your cosmic profits with no hidden fees, transparent divine rules, and instant payouts from the realm of giants.",
    primaryCTA: "Begin Your Ascension",
    secondaryCTA: "Explore Divine Programs"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Hero content saved:', heroContent);
  };

  const handlePrimaryCTA = () => {
    navigate('/checkout?program=heracles&size=10000');
  };

  const handleSecondaryCTA = () => {
    navigate('/#programs');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background bg-stars overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-5xl mx-auto">
          {isEditing ? (
            <div className="space-y-6 p-8 bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-primary/20">
              <input
                type="text"
                value={heroContent.title}
                onChange={(e) => setHeroContent({...heroContent, title: e.target.value})}
                className="w-full text-4xl md:text-6xl font-bold text-center bg-transparent border-b-2 border-primary focus:outline-none text-foreground"
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
                className="w-full text-lg text-muted-foreground text-center bg-transparent border border-muted rounded-lg resize-none focus:outline-none p-4"
                rows={4}
              />
              <div className="flex gap-4 justify-center flex-wrap">
                <input
                  type="text"
                  value={heroContent.primaryCTA}
                  onChange={(e) => setHeroContent({...heroContent, primaryCTA: e.target.value})}
                  className="bg-transparent border border-primary rounded-lg px-6 py-3 focus:outline-none text-center"
                />
                <input
                  type="text"
                  value={heroContent.secondaryCTA}
                  onChange={(e) => setHeroContent({...heroContent, secondaryCTA: e.target.value})}
                  className="bg-transparent border border-muted rounded-lg px-6 py-3 focus:outline-none text-center"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl md:text-3xl text-primary font-semibold mb-6 animate-fade-in animate-glow">
                  ⚡ {heroContent.subtitle} ⚡
                </h2>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                  {heroContent.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in leading-relaxed">
                  {heroContent.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in">
                <Button 
                  size="lg" 
                  onClick={handlePrimaryCTA}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold group shadow-lg shadow-primary/25"
                >
                  ⚔️ {heroContent.primaryCTA}
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleSecondaryCTA}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  🌌 {heroContent.secondaryCTA}
                </Button>
              </div>

              <Button 
                onClick={() => setIsEditing(true)} 
                variant="ghost" 
                size="sm"
                className="absolute top-6 right-6 opacity-50 hover:opacity-100 z-20"
              >
                Edit Hero
              </Button>
            </>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fade-in">
              <div className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:bg-card/50 hover:border-primary/40 transition-all duration-300 group">
                <TrendingUp className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <h3 className="font-bold text-lg text-foreground">⚡ Up to $200K Divine Funding</h3>
                  <p className="text-sm text-muted-foreground">Scale up to $1M with the power of giants</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:bg-card/50 hover:border-primary/40 transition-all duration-300 group">
                <Shield className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <h3 className="font-bold text-lg text-foreground">🛡️ 70% Mythic Profit Split</h3>
                  <p className="text-sm text-muted-foreground">Keep the majority of your cosmic gains</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:bg-card/50 hover:border-primary/40 transition-all duration-300 group">
                <Zap className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <h3 className="font-bold text-lg text-foreground">⚡ 24-Hour Cosmic Payouts</h3>
                  <p className="text-sm text-muted-foreground">Withdrawals approved within 24 hours max</p>
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
