
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
      subtitle: 'The Strongest Hero\'s Challenge',
      icon: '⚡',
      description: 'Channel the mighty strength of Heracles, hero of twelve labors. Access instant funding like the hero who conquered the Nemean Lion and slayed the Hydra. No trials, just pure heroic trading power.',
      features: ['⚡ Instant funding like Heracles\' strength', '🚫 No evaluation - direct to greatness', '💰 Up to 70:30 profit split', '♾️ Unlimited trading like endless battles', '🛡️ Protection of the gods'],
      accounts: [
        { size: '$2,500', fee: '$129', phase1: '$250 (10%)', phase2: '$125 (5%)', phase3: '$125 (5%)', dailyDD: '$100 (4%)', maxDD: '$175 (7%)', split: 'Up to 70:30' },
        { size: '$5,000', fee: '$239', phase1: '$500 (10%)', phase2: '$250 (5%)', phase3: '$250 (5%)', dailyDD: '$200 (4%)', maxDD: '$350 (7%)', split: 'Up to 70:30' },
        { size: '$10,000', fee: '$449', phase1: '$1,000 (10%)', phase2: '$500 (5%)', phase3: '$500 (5%)', dailyDD: '$400 (4%)', maxDD: '$700 (7%)', split: 'Up to 70:30' },
        { size: '$25,000', fee: '$1,149', phase1: '$2,500 (10%)', phase2: '$1,250 (5%)', phase3: '$1,250 (5%)', dailyDD: '$1,000 (4%)', maxDD: '$1,750 (7%)', split: 'Up to 70:30' },
        { size: '$50,000', fee: '$2,299', phase1: '$5,000 (10%)', phase2: '$2,500 (5%)', phase3: '$2,500 (5%)', dailyDD: '$2,000 (4%)', maxDD: '$3,500 (7%)', split: 'Up to 70:30' },
        { size: '$100,000', fee: '$4,599', phase1: '$10,000 (10%)', phase2: '$5,000 (5%)', phase3: '$5,000 (5%)', dailyDD: '$4,000 (4%)', maxDD: '$7,000 (7%)', split: 'Up to 70:30' }
      ],
      popular: true,
      color: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'orion',
      name: 'Orion Trader Program',
      subtitle: 'The Hunter\'s Single Quest',
      icon: '🎯',
      description: 'Follow the path of Orion, the great hunter among the stars. One stellar challenge to prove your worth, just as Orion proved himself hunting the greatest beasts across the cosmos.',
      features: ['🎯 One stellar evaluation quest', '💎 Up to 70:30 cosmic profit split', '♾️ Unlimited trading across galaxies', '💸 Refundable quest fee', '⭐ Stellar performance like Orion'],
      accounts: [
        { size: '$2,500', fee: '$59', target: '$250 (10%)', dailyDD: '$100 (4%)', maxDD: '$200 (8%)', payout: '$125 (5%)', split: 'Up to 70:30' },
        { size: '$5,000', fee: '$89', target: '$500 (10%)', dailyDD: '$200 (4%)', maxDD: '$400 (8%)', payout: '$250 (5%)', split: 'Up to 70:30' },
        { size: '$10,000', fee: '$149', target: '$1,000 (10%)', dailyDD: '$400 (4%)', maxDD: '$800 (8%)', payout: '$500 (5%)', split: 'Up to 70:30' },
        { size: '$25,000', fee: '$249', target: '$2,500 (10%)', dailyDD: '$1,000 (4%)', maxDD: '$2,000 (8%)', payout: '$1,250 (5%)', split: 'Up to 70:30' },
        { size: '$50,000', fee: '$449', target: '$5,000 (10%)', dailyDD: '$2,000 (4%)', maxDD: '$4,000 (8%)', payout: '$2,500 (5%)', split: 'Up to 70:30' },
        { size: '$100,000', fee: '$749', target: '$10,000 (10%)', dailyDD: '$4,000 (4%)', maxDD: '$8,000 (8%)', payout: '$5,000 (5%)', split: 'Up to 70:30' }
      ],
      popular: false,
      color: 'from-primary/20 to-accent/20'
    },
    {
      id: 'zeus',
      name: 'Zeus Trader Program',
      subtitle: 'King of Olympus Challenge',
      icon: '⚡',
      description: 'Ascend Mount Olympus with Zeus, king of gods and ruler of the heavens. Face two thunderous trials to earn your place among the trading giants, just as Zeus conquered the Titans.',
      features: ['⚡ Two thunderous trials like Zeus', '👑 Up to 70:30 royal profit split', '♾️ Unlimited trading dominion', '💰 Lowest fees in the kingdom', '🏛️ Olympian trader status'],
      accounts: [
        { size: '$2,500', fee: '$27', phase1: '$250 (10%)', phase2: '$125 (5%)', dailyDD: '$100 (4%)', maxDD: '$200 (8%)', payout: '$125 (5%)', split: 'Up to 70:30' },
        { size: '$5,000', fee: '$47', phase1: '$500 (10%)', phase2: '$250 (5%)', dailyDD: '$200 (4%)', maxDD: '$400 (8%)', payout: '$250 (5%)', split: 'Up to 70:30' },
        { size: '$10,000', fee: '$87', phase1: '$1,000 (10%)', phase2: '$500 (5%)', dailyDD: '$400 (4%)', maxDD: '$800 (8%)', payout: '$500 (5%)', split: 'Up to 70:30' },
        { size: '$25,000', fee: '$187', phase1: '$2,500 (10%)', phase2: '$1,250 (5%)', dailyDD: '$1,000 (4%)', maxDD: '$2,000 (8%)', payout: '$1,250 (5%)', split: 'Up to 70:30' },
        { size: '$50,000', fee: '$367', phase1: '$5,000 (10%)', phase2: '$2,500 (5%)', dailyDD: '$2,000 (4%)', maxDD: '$4,000 (8%)', payout: '$2,500 (5%)', split: 'Up to 70:30' },
        { size: '$100,000', fee: '$567', phase1: '$10,000 (10%)', phase2: '$5,000 (5%)', dailyDD: '$4,000 (4%)', maxDD: '$8,000 (8%)', payout: '$5,000 (5%)', split: 'Up to 70:30' }
      ],
      popular: false,
      color: 'from-blue-500/20 to-purple-500/20'
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState('heracles');

  const currentProgram = programs.find(p => p.id === selectedProgram);

  const getFeatureRows = (program) => {
    if (program.id === 'heracles') {
      return [
        { label: '⚡ Phase 1', key: 'phase1' },
        { label: '⚡ Phase 2', key: 'phase2' },
        { label: '⚡ Phase 3', key: 'phase3' },
        { label: '📉 Daily DD', key: 'dailyDD' },
        { label: '📊 Max DD', key: 'maxDD' },
        { label: '🏆 Profit Split', key: 'split' }
      ];
    } else if (program.id === 'orion') {
      return [
        { label: '🎯 Target', key: 'target' },
        { label: '📉 Daily DD', key: 'dailyDD' },
        { label: '📊 Max DD', key: 'maxDD' },
        { label: '💸 Payout', key: 'payout' },
        { label: '🏆 Profit Split', key: 'split' }
      ];
    } else if (program.id === 'zeus') {
      return [
        { label: '⚡ Phase 1', key: 'phase1' },
        { label: '⚡ Phase 2', key: 'phase2' },
        { label: '📉 Daily DD', key: 'dailyDD' },
        { label: '📊 Max DD', key: 'maxDD' },
        { label: '💸 Payout', key: 'payout' },
        { label: '🏆 Profit Split', key: 'split' }
      ];
    }
    return [];
  };

  return (
    <section id="programs" className="py-20 bg-background bg-stars relative overflow-hidden">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      {/* Galactic particles effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            🌌 Giants Trading Programs 🌌
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path among the giants. Each program channels the power of legendary gods and heroes to achieve cosmic prosperity and stellar profits.
          </p>
        </div>

        {/* Program Selection */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {programs.map((program) => (
            <Button
              key={program.id}
              onClick={() => setSelectedProgram(program.id)}
              variant={selectedProgram === program.id ? "default" : "outline"}
              className={`relative px-8 py-4 text-lg font-semibold transition-all duration-300 backdrop-blur-sm border-2 ${
                selectedProgram === program.id 
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 scale-105 border-primary/50' 
                  : 'border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
              }`}
            >
              <span className="mr-3 text-2xl">{program.icon}</span>
              {program.name}
              {program.popular && (
                <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-accent to-primary text-primary-foreground animate-pulse border-none">
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
            <Card className={`mb-12 border-primary/20 shadow-2xl bg-gradient-to-br ${currentProgram.color} backdrop-blur-lg border-2 hover:border-primary/40 transition-all duration-500`}>
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
                    <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground font-['Inter',sans-serif]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Enhanced Galactic Pricing Table */}
                <div className="galactic-table-container-v2 overflow-hidden rounded-2xl border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-card/95 to-background/90 backdrop-blur-lg hover:border-primary/50 transition-all duration-500">
                  {/* Account Sizes Header Row */}
                  <div className="table-header bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground shadow-lg">
                    <div className="galactic-grid-v2">
                      <div className="galactic-header-cell-v2 feature-header">
                        <div className="text-center font-black text-sm md:text-base px-2 py-4">Features</div>
                      </div>
                      {currentProgram.accounts.map((account, index) => (
                        <div key={index} className={`galactic-header-cell-v2 ${index === currentProgram.accounts.length - 1 ? 'large-account' : ''}`}>
                          <div className="text-center font-black text-sm md:text-lg px-2 py-4 bg-gradient-to-b from-white/20 to-transparent rounded-lg backdrop-blur-sm">
                            {account.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Rows */}
                  <div className="table-body bg-gradient-to-b from-card/80 to-background/60">
                    {getFeatureRows(currentProgram).map((row, rowIndex) => (
                      <div key={rowIndex} className={`galactic-grid-v2 border-t border-primary/10 first:border-t-0 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:shadow-lg ${
                        rowIndex % 2 === 0 ? 'bg-gradient-to-r from-background/60 to-card/40' : 'bg-gradient-to-r from-card/40 to-background/60'
                      }`}>
                        <div className="galactic-data-cell-v2 feature-label">
                          <div className="px-4 py-4 font-bold text-foreground text-sm md:text-base">
                            {row.label}
                          </div>
                        </div>
                        {currentProgram.accounts.map((account, accountIndex) => (
                          <div key={accountIndex} className={`galactic-data-cell-v2 ${accountIndex === currentProgram.accounts.length - 1 ? 'large-account' : ''}`}>
                            <div className="px-4 py-4 text-foreground font-medium text-xs md:text-sm">
                              {account[row.key]}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Price Row */}
                    <div className="galactic-grid-v2 border-t-2 border-primary/30 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 backdrop-blur-sm">
                      <div className="galactic-data-cell-v2 feature-label">
                        <div className="px-4 py-4 font-bold text-primary text-sm md:text-base">
                          💰 Price
                        </div>
                      </div>
                      {currentProgram.accounts.map((account, accountIndex) => (
                        <div key={accountIndex} className={`galactic-data-cell-v2 ${accountIndex === currentProgram.accounts.length - 1 ? 'large-account' : ''}`}>
                          <div className="px-4 py-4 font-bold text-accent text-sm md:text-lg">
                            {account.fee}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons Row - Fixed alignment */}
                <div className="galactic-grid-v2 mt-6 gap-4">
                  <div className="feature-header"></div>
                  {currentProgram.accounts.map((account, accountIndex) => (
                    <div key={accountIndex} className={`flex justify-center ${accountIndex === currentProgram.accounts.length - 1 ? 'large-account' : ''}`}>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-4 py-2 text-sm font-bold shadow-lg shadow-primary/25 font-['Inter',sans-serif] w-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 border border-primary/30">
                        <Zap className="w-4 h-4 mr-2" />
                        Get {account.size}
                      </Button>
                    </div>
                  ))}
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
