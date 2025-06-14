
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sword, Shield, Zap, Crown, Star, Flame } from 'lucide-react';

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    title: "ASCEND TO TRADING OLYMPUS",
    subtitle: "⚡ GODLIKE PROP TRADING ARENA ⚡",
    description: "Join the pantheon of elite warriors. Harness divine power with funding up to $200,000 and claim up to 80% of your conquered profits. Lightning-fast payouts, transparent divine laws, and the blessing of the trading gods await.",
    primaryCTA: "⚔️ BEGIN YOUR CONQUEST",
    secondaryCTA: "🏛️ EXPLORE DIVINE PROGRAMS"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Hero content saved:', heroContent);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background bg-cosmic-stars overflow-hidden">
      {/* Divine Background Elements */}
      <div className="absolute inset-0 bg-divine-gradient"></div>
      
      {/* Floating Divine Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-olympus-float"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/25 rounded-full blur-3xl animate-olympus-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-red-500/15 rounded-full blur-3xl animate-olympus-float" style={{animationDelay: '6s'}}></div>
      
      {/* Central Divine Aura */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/10 via-transparent to-transparent animate-war-glow"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-6xl mx-auto">
          {isEditing ? (
            <div className="space-y-6 p-8 card-divine rounded-2xl shadow-2xl border-divine-glow">
              <input
                type="text"
                value={heroContent.title}
                onChange={(e) => setHeroContent({...heroContent, title: e.target.value})}
                className="w-full text-4xl md:text-6xl font-bold text-center bg-transparent border-b-2 border-primary focus:outline-none text-foreground cinzel-font"
              />
              <input
                type="text"
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent({...heroContent, subtitle: e.target.value})}
                className="w-full text-xl md:text-2xl text-primary text-center bg-transparent border-b border-primary/50 focus:outline-none cinzel-font"
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
                <Button onClick={handleSave} className="btn-divine">Save Changes</Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <h2 className="text-2xl md:text-4xl text-primary font-bold mb-8 animate-divine-fade animate-lightning-pulse cinzel-font text-divine-glow">
                  {heroContent.subtitle}
                </h2>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-divine-fade cinzel-font text-divine-glow">
                  {heroContent.title}
                </h1>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Star className="h-8 w-8 text-primary animate-lightning-pulse" />
                  <Crown className="h-10 w-10 text-accent animate-lightning-pulse" style={{animationDelay: '0.5s'}} />
                  <Star className="h-8 w-8 text-primary animate-lightning-pulse" style={{animationDelay: '1s'}} />
                </div>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 animate-divine-fade leading-relaxed font-medium">
                  {heroContent.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 animate-divine-fade">
                <Button size="lg" className="btn-divine px-12 py-6 text-xl font-bold group shadow-2xl cinzel-font">
                  {heroContent.primaryCTA}
                  <Sword className="ml-4 h-7 w-7 group-hover:rotate-12 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary/60 text-primary hover:bg-primary hover:text-black px-12 py-6 text-xl font-bold shadow-xl cinzel-font">
                  {heroContent.secondaryCTA}
                </Button>
              </div>

              <Button 
                onClick={() => setIsEditing(true)} 
                variant="ghost" 
                size="sm"
                className="absolute top-6 right-6 opacity-30 hover:opacity-100 z-20 text-primary"
              >
                Edit Hero
              </Button>
            </>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 animate-divine-fade">
              <div className="group">
                <div className="card-divine p-10 rounded-2xl hover:border-primary/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-full">
                      <Flame className="h-12 w-12 text-primary group-hover:scale-110 transition-transform animate-lightning-pulse" />
                    </div>
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-4 cinzel-font text-divine-glow">⚡ DIVINE FUNDING</h3>
                  <p className="text-lg text-muted-foreground">Wield up to $200,000 in trading power</p>
                  <p className="text-sm text-primary mt-2 font-semibold">Channel the strength of the gods</p>
                </div>
              </div>
              
              <div className="group">
                <div className="card-divine p-10 rounded-2xl hover:border-primary/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-br from-accent/20 to-red-500/20 p-4 rounded-full">
                      <Crown className="h-12 w-12 text-accent group-hover:scale-110 transition-transform animate-lightning-pulse" style={{animationDelay: '0.5s'}} />
                    </div>
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-4 cinzel-font text-divine-glow">👑 ROYAL PROFIT SPLIT</h3>
                  <p className="text-lg text-muted-foreground">Claim up to 80% of your conquests</p>
                  <p className="text-sm text-accent mt-2 font-semibold">Keep the lion's share of your victories</p>
                </div>
              </div>
              
              <div className="group">
                <div className="card-divine p-10 rounded-2xl hover:border-primary/60 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-br from-red-500/20 to-primary/20 p-4 rounded-full">
                      <Zap className="h-12 w-12 text-red-400 group-hover:scale-110 transition-transform animate-lightning-pulse" style={{animationDelay: '1s'}} />
                    </div>
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-4 cinzel-font text-divine-glow">⚡ LIGHTNING PAYOUTS</h3>
                  <p className="text-lg text-muted-foreground">Instant withdrawals within 24 hours</p>
                  <p className="text-sm text-red-400 mt-2 font-semibold">Faster than Zeus's thunderbolt</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Divine Symbols */}
      <div className="absolute top-1/4 left-1/4 opacity-20">
        <Shield className="h-16 w-16 text-primary animate-olympus-float" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 opacity-20">
        <Crown className="h-20 w-20 text-accent animate-olympus-float" style={{animationDelay: '4s'}} />
      </div>
      <div className="absolute top-3/4 left-1/3 opacity-20">
        <Flame className="h-14 w-14 text-red-400 animate-olympus-float" style={{animationDelay: '2s'}} />
      </div>
    </section>
  );
};

export default Hero;
