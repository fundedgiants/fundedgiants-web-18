
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Target, Crown } from 'lucide-react';

const TradingPrograms = () => {
  const [programs, setPrograms] = useState([
    {
      id: 'heracles',
      name: 'Heracles Trader',
      subtitle: 'Instant Divine Power',
      icon: '⚡',
      description: 'Harness the strength of Heracles with instant access to funded accounts. No trials, just pure divine trading power.',
      features: ['⚡ Instant funding', '🚫 No evaluation required', '💰 50:50 to 70:30 profit split', '♾️ Unlimited trading days', '🛡️ Divine protection'],
      accounts: [
        { size: '$2,500', fee: '$129', phase1: '$250 (10%)', phase2: '$125 (5%)', phase3: '$125 (5%)', dailyDD: '$100 (4%)', maxDD: '$175 (7%)', split: '50%' },
        { size: '$5,000', fee: '$239', phase1: '$500 (10%)', phase2: '$250 (5%)', phase3: '$250 (5%)', dailyDD: '$200 (4%)', maxDD: '$350 (7%)', split: '50%' },
        { size: '$10,000', fee: '$449', phase1: '$1,000 (10%)', phase2: '$500 (5%)', phase3: '$500 (5%)', dailyDD: '$400 (4%)', maxDD: '$700 (7%)', split: '60%' },
        { size: '$25,000', fee: '$1,149', phase1: '$2,500 (10%)', phase2: '$1,250 (5%)', phase3: '$1,250 (5%)', dailyDD: '$1,000 (4%)', maxDD: '$1,750 (7%)', split: '70%' },
        { size: '$50,000', fee: '$2,299', phase1: '$5,000 (10%)', phase2: '$2,500 (5%)', phase3: '$2,500 (5%)', dailyDD: '$2,000 (4%)', maxDD: '$3,500 (7%)', split: '70%' },
        { size: '$100,000', fee: '$4,599', phase1: '$10,000 (10%)', phase2: '$5,000 (5%)', phase3: '$5,000 (5%)', dailyDD: '$4,000 (4%)', maxDD: '$7,000 (7%)', split: '70%' }
      ],
      popular: false,
      color: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'orion',
      name: 'Orion Trader Program',
      subtitle: 'Celestial One-Step Ascension',
      icon: '🎯',
      description: 'Follow the constellation of Orion through a single celestial challenge to reach trading immortality.',
      features: ['🎯 One divine evaluation', '💎 70:30 cosmic profit split', '♾️ Unlimited trading epochs', '💸 Refundable assessment fee', '⭐ Stellar performance tracking'],
      accounts: [
        { size: '$2,500', fee: '$59', target: '$250 (10%)', dailyDD: '$100 (4%)', maxDD: '$200 (8%)', payout: '$125 (5%)', split: '70%' },
        { size: '$5,000', fee: '$89', target: '$500 (10%)', dailyDD: '$200 (4%)', maxDD: '$400 (8%)', payout: '$250 (5%)', split: '70%' },
        { size: '$10,000', fee: '$149', target: '$1,000 (10%)', dailyDD: '$400 (4%)', maxDD: '$800 (8%)', payout: '$500 (5%)', split: '70%' },
        { size: '$25,000', fee: '$249', target: '$2,500 (10%)', dailyDD: '$1,000 (4%)', maxDD: '$2,000 (8%)', payout: '$1,250 (5%)', split: '70%' },
        { size: '$50,000', fee: '$449', target: '$5,000 (10%)', dailyDD: '$2,000 (4%)', maxDD: '$4,000 (8%)', payout: '$2,500 (5%)', split: '70%' },
        { size: '$100,000', fee: '$749', target: '$10,000 (10%)', dailyDD: '$4,000 (4%)', maxDD: '$8,000 (8%)', payout: '$5,000 (5%)', split: '70%' }
      ],
      popular: true,
      color: 'from-primary/20 to-accent/20'
    },
    {
      id: 'zeus',
      name: 'Zeus Trader Program',
      subtitle: 'Supreme Two-Phase Dominion',
      icon: '⚡',
      description: 'Channel the supreme power of Zeus through two divine phases to achieve ultimate trading sovereignty.',
      features: ['⚡ Two thunderous evaluations', '👑 70:30 supreme profit split', '♾️ Unlimited divine trading', '💰 Lowest assessment fees', '🏛️ Olympian trader status'],
      accounts: [
        { size: '$2,500', fee: '$27', phase1: '$250 (10%)', phase2: '$125 (5%)', dailyDD: '$100 (4%)', maxDD: '$200 (8%)', payout: '$125 (5%)', split: '70%' },
        { size: '$5,000', fee: '$47', phase1: '$500 (10%)', phase2: '$250 (5%)', dailyDD: '$200 (4%)', maxDD: '$400 (8%)', payout: '$250 (5%)', split: '70%' },
        { size: '$10,000', fee: '$87', phase1: '$1,000 (10%)', phase2: '$500 (5%)', dailyDD: '$400 (4%)', maxDD: '$800 (8%)', payout: '$500 (5%)', split: '70%' },
        { size: '$25,000', fee: '$187', phase1: '$2,500 (10%)', phase2: '$1,250 (5%)', dailyDD: '$1,000 (4%)', maxDD: '$2,000 (8%)', payout: '$1,250 (5%)', split: '70%' },
        { size: '$50,000', fee: '$367', phase1: '$5,000 (10%)', phase2: '$2,500 (5%)', dailyDD: '$2,000 (4%)', maxDD: '$4,000 (8%)', payout: '$2,500 (5%)', split: '70%' },
        { size: '$100,000', fee: '$567', phase1: '$10,000 (10%)', phase2: '$5,000 (5%)', dailyDD: '$4,000 (4%)', maxDD: '$8,000 (8%)', payout: '$5,000 (5%)', split: '70%' }
      ],
      popular: false,
      color: 'from-blue-500/20 to-purple-500/20'
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState('orion');

  const currentProgram = programs.find(p => p.id === selectedProgram);

  return (
    <section id="programs" className="py-20 bg-background bg-stars relative">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            🌌 Divine Trading Programs 🌌
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path to trading godhood. Each program offers a unique journey to cosmic prosperity and divine profits.
          </p>
        </div>

        {/* Program Selection */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {programs.map((program) => (
            <Button
              key={program.id}
              onClick={() => setSelectedProgram(program.id)}
              variant={selectedProgram === program.id ? "default" : "outline"}
              className={`relative px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                selectedProgram === program.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105' 
                  : 'border-primary/50 text-primary hover:bg-primary/10'
              }`}
            >
              <span className="mr-3 text-2xl">{program.icon}</span>
              {program.name}
              {program.popular && (
                <Badge className="absolute -top-3 -right-3 bg-accent text-accent-foreground animate-pulse">
                  <Crown className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Program Details */}
        {currentProgram && (
          <div className="max-w-7xl mx-auto">
            <Card className={`mb-12 border-primary/30 shadow-2xl bg-gradient-to-br ${currentProgram.color} backdrop-blur-sm`}>
              <CardHeader className="text-center pb-8">
                <div className="text-6xl mb-6 animate-float">{currentProgram.icon}</div>
                <CardTitle className="text-3xl md:text-4xl mb-4 text-foreground font-['Inter',sans-serif]">
                  {currentProgram.name}
                  <span className="text-primary ml-3">({currentProgram.subtitle})</span>
                </CardTitle>
                <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">{currentProgram.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                  {currentProgram.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground font-['Inter',sans-serif]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pricing Table */}
                <div className="overflow-hidden rounded-2xl border-2 border-primary/40 shadow-2xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg">
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground">
                    <div className="grid grid-cols-7 md:grid-cols-8 gap-2 p-4 font-bold text-xs md:text-sm font-['Inter',sans-serif]">
                      <div className="text-center font-black text-sm md:text-base">💎 Account</div>
                      <div className="text-center font-black text-sm md:text-base">💰 Fee</div>
                      <div className="text-center font-black text-xs md:text-sm">
                        {currentProgram.id === 'heracles' ? '⚡ Phase 1' : '🎯 Target'}
                      </div>
                      {currentProgram.id === 'heracles' && (
                        <>
                          <div className="text-center font-black text-xs md:text-sm">⚡ Phase 2</div>
                          <div className="text-center font-black text-xs md:text-sm">⚡ Phase 3</div>
                        </>
                      )}
                      {currentProgram.id === 'zeus' && <div className="text-center font-black text-xs md:text-sm">⚡ Phase 2</div>}
                      <div className="text-center font-black text-xs md:text-sm">📉 Daily DD</div>
                      <div className="text-center font-black text-xs md:text-sm">📊 Max DD</div>
                      {(currentProgram.id === 'orion' || currentProgram.id === 'zeus') && (
                        <div className="text-center font-black text-xs md:text-sm">💸 Payout</div>
                      )}
                      <div className="text-center font-black text-sm md:text-base">🏆 Split</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y-2 divide-primary/20">
                    {currentProgram.accounts.map((account, index) => (
                      <div key={index} className={`grid grid-cols-7 md:grid-cols-8 gap-2 p-4 text-xs md:text-sm transition-all duration-300 hover:bg-primary/10 hover:scale-[1.02] ${
                        index % 2 === 0 ? 'bg-background/60' : 'bg-muted/30'
                      }`}>
                        <div className="text-center font-bold text-primary text-sm md:text-lg font-['Inter',sans-serif] flex items-center justify-center">
                          {account.size}
                        </div>
                        <div className="text-center font-bold text-accent text-sm md:text-base font-['Inter',sans-serif] flex items-center justify-center">
                          {account.fee}
                        </div>
                        
                        {currentProgram.id === 'heracles' && (
                          <>
                            <div className="text-center text-foreground font-medium flex items-center justify-center text-xs md:text-sm">{account.phase1}</div>
                            <div className="text-center text-foreground font-medium flex items-center justify-center text-xs md:text-sm">{account.phase2}</div>
                            <div className="text-center text-foreground font-medium flex items-center justify-center text-xs md:text-sm">{account.phase3}</div>
                          </>
                        )}
                        
                        {currentProgram.id === 'orion' && (
                          <div className="text-center text-foreground font-medium flex items-center justify-center text-xs md:text-sm">{account.target}</div>
                        )}
                        
                        {currentProgram.id === 'zeus' && (
                          <>
                            <div className="text-center text-foreground font-medium flex items-center justify-center text-xs md:text-sm">{account.phase1}</div>
                            <div className="text-center text-foreground font-medium flex items-center justify-center text-xs md:text-sm">{account.phase2}</div>
                          </>
                        )}
                        
                        <div className="text-center text-destructive font-semibold flex items-center justify-center text-xs md:text-sm">{account.dailyDD}</div>
                        <div className="text-center text-destructive font-semibold flex items-center justify-center text-xs md:text-sm">{account.maxDD}</div>
                        
                        {(currentProgram.id === 'orion' || currentProgram.id === 'zeus') && (
                          <div className="text-center text-accent font-semibold flex items-center justify-center text-xs md:text-sm">{account.payout}</div>
                        )}
                        
                        <div className="text-center font-bold text-primary text-sm md:text-base font-['Inter',sans-serif] flex items-center justify-center">
                          {account.split}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-12">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-xl font-bold shadow-lg shadow-primary/25 font-['Inter',sans-serif]">
                    🚀 Begin {currentProgram.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default TradingPrograms;
