
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Target } from 'lucide-react';

const TradingPrograms = () => {
  const [programs, setPrograms] = useState([
    {
      id: 'heracles',
      name: 'Heracles Trader',
      subtitle: 'Instant Funding',
      icon: '⚡',
      description: 'Get instant access to funded accounts with no evaluation required',
      features: ['Instant funding', 'No evaluation', '50:50 to 70:30 profit split', 'Unlimited trading days'],
      accounts: [
        { size: '$2,500', fee: '$129', profitTarget1: '$250 (10%)', profitTarget2: '$125 (5%)', profitTarget3: '$125 (5%)', dailyDD: '$100 (4%)', overallDD: '$175 (7%)' },
        { size: '$5,000', fee: '$239', profitTarget1: '$500 (10%)', profitTarget2: '$250 (5%)', profitTarget3: '$250 (5%)', dailyDD: '$200 (4%)', overallDD: '$350 (7%)' },
        { size: '$10,000', fee: '$449', profitTarget1: '$1,000 (10%)', profitTarget2: '$500 (5%)', profitTarget3: '$500 (5%)', dailyDD: '$400 (4%)', overallDD: '$700 (7%)' },
        { size: '$25,000', fee: '$1149', profitTarget1: '$2500 (10%)', profitTarget2: '$1250 (5%)', profitTarget3: '$1250 (5%)', dailyDD: '$1000 (4%)', overallDD: '$1750 (7%)' },
        { size: '$50,000', fee: '$2299', profitTarget1: '$5000 (10%)', profitTarget2: '$2500 (5%)', profitTarget3: '$2500 (5%)', dailyDD: '$2000 (4%)', overallDD: '$3500 (7%)' },
        { size: '$100,000', fee: '$4599', profitTarget1: '$10,000 (10%)', profitTarget2: '$5000 (5%)', profitTarget3: '$5000 (5%)', dailyDD: '$4000 (4%)', overallDD: '$7000 (7%)' }
      ],
      popular: false
    },
    {
      id: 'orion',
      name: 'Orion Trader Program',
      subtitle: '1 Step Challenge',
      icon: '🎯',
      description: 'Single phase evaluation with competitive profit targets',
      features: ['One evaluation phase', '70:30 profit split', 'Unlimited trading days', 'Refundable assessment fee'],
      accounts: [
        { size: '$2,500', fee: '$59', profitTarget1: '$250 (10%)', dailyDD: '$100 (4%)', overallDD: '$200 (8%)', firstPayout: '$125 (5%)' },
        { size: '$5,000', fee: '$89', profitTarget1: '$500 (10%)', dailyDD: '$200 (4%)', overallDD: '$400 (8%)', firstPayout: '$250 (5%)' },
        { size: '$10,000', fee: '$149', profitTarget1: '$1,000 (10%)', dailyDD: '$400 (4%)', overallDD: '$800 (8%)', firstPayout: '$500 (5%)' },
        { size: '$25,000', fee: '$249', profitTarget1: '$2,500 (10%)', dailyDD: '$1000 (4%)', overallDD: '$2000 (8%)', firstPayout: '$1250 (5%)' },
        { size: '$50,000', fee: '$449', profitTarget1: '$5,000 (10%)', dailyDD: '$2000 (4%)', overallDD: '$4000 (8%)', firstPayout: '$2500 (5%)' },
        { size: '$100,000', fee: '$749', profitTarget1: '$10,000 (10%)', dailyDD: '$4000 (4%)', overallDD: '$8000 (8%)', firstPayout: '$5,000 (5%)' }
      ],
      popular: true
    },
    {
      id: 'zeus',
      name: 'Zeus Trader Program',
      subtitle: '2 Step Challenge',
      icon: '⭐',
      description: 'Two-phase evaluation for maximum account sizes',
      features: ['Two evaluation phases', '70:30 profit split', 'Unlimited trading days', 'Lowest assessment fees'],
      accounts: [
        { size: '$2,500', fee: '$27', profitTarget1: '$250 (10%)', profitTarget2: '$125 (5%)', dailyDD: '$100 (4%)', overallDD: '$200 (8%)', firstPayout: '$125 (5%)' },
        { size: '$5,000', fee: '$47', profitTarget1: '$500 (10%)', profitTarget2: '$250 (5%)', dailyDD: '$200 (4%)', overallDD: '$400 (8%)', firstPayout: '$250 (5%)' },
        { size: '$10,000', fee: '$87', profitTarget1: '$1,000 (10%)', profitTarget2: '$750 (5%)', dailyDD: '$400 (4%)', overallDD: '$800 (8%)', firstPayout: '$500 (5%)' },
        { size: '$25,000', fee: '$187', profitTarget1: '$2,500 (10%)', profitTarget2: '$1,250 (5%)', dailyDD: '$1000 (4%)', overallDD: '$2000 (8%)', firstPayout: '$1250 (5%)' },
        { size: '$50,000', fee: '$367', profitTarget1: '$5,000 (10%)', profitTarget2: '$2,500 (5%)', dailyDD: '$2000 (4%)', overallDD: '$4000 (8%)', firstPayout: '$2500 (5%)' },
        { size: '$100,000', fee: '$567', profitTarget1: '$10,000 (10%)', profitTarget2: '$5,000 (5%)', dailyDD: '$4000 (4%)', overallDD: '$8000 (8%)', firstPayout: '$5,000 (5%)' }
      ],
      popular: false
    }
  ]);

  const [selectedProgram, setSelectedProgram] = useState('orion');
  const [isEditing, setIsEditing] = useState(false);

  const currentProgram = programs.find(p => p.id === selectedProgram);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Trading Programs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect program for your trading style and experience level
          </p>
        </div>

        {/* Program Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {programs.map((program) => (
            <Button
              key={program.id}
              onClick={() => setSelectedProgram(program.id)}
              variant={selectedProgram === program.id ? "default" : "outline"}
              className={`relative ${selectedProgram === program.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              <span className="mr-2">{program.icon}</span>
              {program.name}
              {program.popular && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Program Details */}
        {currentProgram && (
          <div className="max-w-6xl mx-auto">
            <Card className="mb-8 border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="text-4xl mb-4">{currentProgram.icon}</div>
                <CardTitle className="text-2xl md:text-3xl mb-2">
                  {currentProgram.name}
                  <span className="text-primary ml-2">({currentProgram.subtitle})</span>
                </CardTitle>
                <p className="text-muted-foreground text-lg">{currentProgram.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {currentProgram.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-primary text-primary-foreground">
                        <th className="p-4 text-left">Account Size</th>
                        <th className="p-4 text-left">Fee</th>
                        <th className="p-4 text-left">Phase 1 Target</th>
                        {currentProgram.id === 'zeus' && <th className="p-4 text-left">Phase 2 Target</th>}
                        {currentProgram.id === 'heracles' && (
                          <>
                            <th className="p-4 text-left">2nd Withdrawal</th>
                            <th className="p-4 text-left">3rd Withdrawal</th>
                          </>
                        )}
                        <th className="p-4 text-left">Daily DD</th>
                        <th className="p-4 text-left">Overall DD</th>
                        {(currentProgram.id === 'orion' || currentProgram.id === 'zeus') && (
                          <th className="p-4 text-left">First Payout</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentProgram.accounts.map((account, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'} hover:bg-primary/5 transition-colors`}>
                          <td className="p-4 font-semibold text-primary">{account.size}</td>
                          <td className="p-4 font-semibold">{account.fee}</td>
                          <td className="p-4">{account.profitTarget1}</td>
                          {currentProgram.id === 'zeus' && <td className="p-4">{account.profitTarget2}</td>}
                          {currentProgram.id === 'heracles' && (
                            <>
                              <td className="p-4">{account.profitTarget2}</td>
                              <td className="p-4">{account.profitTarget3}</td>
                            </>
                          )}
                          <td className="p-4">{account.dailyDD}</td>
                          <td className="p-4">{account.overallDD}</td>
                          {(currentProgram.id === 'orion' || currentProgram.id === 'zeus') && (
                            <td className="p-4">{account.firstPayout}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-center mt-8">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Start {currentProgram.name}
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
