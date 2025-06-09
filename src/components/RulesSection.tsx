
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle } from 'lucide-react';

const RulesSection = () => {
  const [rules, setRules] = useState({
    general: [
      "First Withdrawal, Second and Third Withdrawal: Minimum 3 Trading Days",
      "Subsequent withdrawal: On-Demand (Multiple times Daily)",
      "Balance Based Drawdowns",
      "Consistency Rule: Trader Must Maintain fixed risk exposure consistently (lot size vs Percent risk per trade has to be consistent at least 70% of the time)"
    ],
    prohibited: [
      "No HFT, Hedging, and all prohibited trading styles",
      "No news trading during high-impact events",
      "No martingale or grid trading strategies",
      "No copy trading or signal services",
      "No trading during weekends (when markets are closed)"
    ],
    addOns: [
      {
        name: "Increase Leverage to 1:50",
        price: "+20%"
      },
      {
        name: "Increase DrawDown by 2%",
        price: "+20%"
      },
      {
        name: "Remove Profit Target from 1st, 2nd, and 3rd Withdrawals",
        price: "+30%",
        note: "Also removes minimum Trading Days from first 3 Withdrawals"
      },
      {
        name: "Increase Profit Split (80:20 from onset)",
        price: "+50%"
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Trading Rules & Guidelines
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clear, transparent rules for all account types and optional add-ons
          </p>
          
          <Button 
            onClick={() => setIsEditing(!isEditing)} 
            variant="ghost" 
            size="sm"
            className="absolute top-0 right-0 opacity-50 hover:opacity-100"
          >
            {isEditing ? 'Save Rules' : 'Edit Rules'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* General Rules */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-6 w-6 text-green-500" />
                General Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {rules.general.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    {isEditing ? (
                      <textarea
                        value={rule}
                        onChange={(e) => {
                          const newRules = {...rules};
                          newRules.general[index] = e.target.value;
                          setRules(newRules);
                        }}
                        className="flex-1 bg-transparent border border-muted rounded p-2 resize-none focus:outline-none"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm">{rule}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Rules */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="h-6 w-6 text-destructive" />
                Prohibited Trading Styles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {rules.prohibited.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    {isEditing ? (
                      <textarea
                        value={rule}
                        onChange={(e) => {
                          const newRules = {...rules};
                          newRules.prohibited[index] = e.target.value;
                          setRules(newRules);
                        }}
                        className="flex-1 bg-transparent border border-muted rounded p-2 resize-none focus:outline-none"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm">{rule}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Add-ons Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Available Add-ons for All Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rules.addOns.map((addon, index) => (
                <div key={index} className="p-4 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={addon.name}
                        onChange={(e) => {
                          const newRules = {...rules};
                          newRules.addOns[index].name = e.target.value;
                          setRules(newRules);
                        }}
                        className="flex-1 bg-transparent border-b border-primary/50 focus:outline-none font-semibold"
                      />
                    ) : (
                      <h4 className="font-semibold text-sm flex-1">{addon.name}</h4>
                    )}
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {isEditing ? (
                        <input
                          type="text"
                          value={addon.price}
                          onChange={(e) => {
                            const newRules = {...rules};
                            newRules.addOns[index].price = e.target.value;
                            setRules(newRules);
                          }}
                          className="w-16 bg-transparent focus:outline-none text-center"
                        />
                      ) : (
                        addon.price
                      )}
                    </Badge>
                  </div>
                  {addon.note && (
                    <p className="text-xs text-muted-foreground">
                      {isEditing ? (
                        <input
                          type="text"
                          value={addon.note}
                          onChange={(e) => {
                            const newRules = {...rules};
                            newRules.addOns[index].note = e.target.value;
                            setRules(newRules);
                          }}
                          className="w-full bg-transparent border-b border-muted focus:outline-none"
                        />
                      ) : (
                        addon.note
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RulesSection;
