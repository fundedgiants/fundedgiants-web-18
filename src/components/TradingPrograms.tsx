import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const TradingPrograms = () => {
  const navigate = useNavigate();
  
  const handleGetFunded = (program: string, accountSize: string) => {
    navigate(`/checkout?program=${program}&size=${accountSize}`);
  };

  const programs = [
    {
      name: "Rhino Rush (Instant Funding)",
      subtitle: "Instant Funding",
      description: "Prove your divine trading prowess with our instant funding program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      accountValues: ["2500", "5000", "10000", "25000", "50000", "100000"],
      prices: ["$109", "$209", "$399", "$999", "$1989", "$3989"],
      programKey: "heracles",
      tableData: [
        {
          label: "Daily Drawdown",
          values: ["$100 (4%)", "$200 (4%)", "$400 (4%)", "$1,000 (4%)", "$2,000 (4%)", "$4,000 (4%)"]
        },
        {
          label: "Overall Drawdown", 
          values: ["$175 (7%)", "$350 (7%)", "$700 (7%)", "$1,750 (7%)", "$3,500 (7%)", "$7,000 (7%)"]
        },
        {
          label: "1st Withdrawal",
          subtitle: "5 Min Trading Days",
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "2nd Withdrawal & All Subsequent",
          subtitle: "Daily withdrawal if 5% hit OR 5 Min Trading Days",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1,250 (5%)", "$2,500 (5%)", "$5,000 (5%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "Max Trading Days",
          values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"]
        },
        {
          label: "Available Leverage",
          values: ["1:30", "1:30", "1:30", "1:30", "1:30", "1:30"]
        },
        {
          label: "Fee Refund", 
          values: ["No", "No", "No", "No", "No", "No"]
        },
        {
          label: "Scaling",
          values: ["No Scaling", "2x After 10 Payouts", "2.5x After 10 Payouts", "2x After 10 Payouts", "2x After 10 Payouts", "2x After 10 Payouts"]
        },
        {
          label: "Max Scaling",
          values: ["None", "$50,000", "$100,000", "$250,000", "$500,000", "$1,000,000"]
        }
      ]
    },
    {
      name: "Phoenix Rise (2 Step Challenge)",
      subtitle: "2 Step Challenge",
      description: "Rule the markets like a god with our most prestigious 2-step challenge program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      accountValues: ["2500", "5000", "10000", "25000", "50000", "100000"],
      prices: ["$27", "$47", "$87", "$187", "$367", "$567"],
      programKey: "zeus",
      tableData: [
        {
          label: "Daily Drawdown",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1,250 (5%)", "$2,500 (5%)", "$5,000 (5%)"]
        },
        {
          label: "Overall Drawdown",
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"]
        },
        {
          label: "Profit Target Phase 1",
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"]
        },
        {
          label: "Profit Target Phase 2",
          values: ["$125 (5%)", "$250 (5%)", "$750 (5%)", "$1,250 (5%)", "$2,500 (5%)", "$5,000 (5%)"]
        },
        {
          label: "1st Withdrawal (Funded Stage)",
          subtitle: "5 Min Trading Days",
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "2nd Withdrawal & All Subsequent",
          subtitle: "Daily withdrawal if 5% hit OR 5 Min Trading Days",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1,250 (5%)", "$2,500 (5%)", "$5,000 (5%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "Max Trading Days",
          values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"]
        },
        {
          label: "Available Leverage",
          values: ["1:30", "1:30", "1:30", "1:30", "1:30", "1:30"]
        },
        {
          label: "Fee Refund",
          values: ["Yes", "Yes", "Yes", "Yes", "Yes", "Yes"]
        },
        {
          label: "Scaling",
          values: ["No Scaling", "2x After 10 Payouts", "2.5x After 10 Payouts", "2x After 10 Payouts", "2x After 10 Payouts", "2x After 10 Payouts"]
        },
        {
          label: "Max Scaling",
          values: ["None", "$50,000", "$100,000", "$250,000", "$500,000", "$1,000,000"]
        }
      ]
    }
  ];

  return (
    <section id="programs" className="py-20 bg-galactic-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ⚔️ Choose Your Divine Path ⚔️
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your cosmic trading program and begin your ascension to trading godhood
          </p>
        </div>

        {/* Tabbed Program Selector */}
        <Tabs defaultValue="heracles" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12 bg-cosmic-card border border-cosmic-purple/30">
            <TabsTrigger 
              value="heracles" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              Rhino Rush
            </TabsTrigger>
            <TabsTrigger 
              value="zeus"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              Phoenix Rise
            </TabsTrigger>
          </TabsList>

          {programs.map((program, programIndex) => (
            <TabsContent 
              key={program.name.toLowerCase().replace(' ', '')} 
              value={programIndex === 0 ? 'heracles' : 'zeus'}
            >
              <Card className="bg-cosmic-card border-cosmic-purple/30 shadow-cosmic backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold text-cosmic-blue mb-2">
                    {program.name}
                  </CardTitle>
                  <p className="text-xl text-cosmic-purple font-semibold mb-4">
                    {program.subtitle}
                  </p>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {program.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-cosmic-card/50 rounded-lg overflow-hidden shadow-cosmic">
                      {/* Account Size Headers */}
                      <thead>
                        <tr className="bg-gradient-to-r from-cosmic-purple/40 via-cosmic-blue/40 to-cosmic-purple/40 border-b border-cosmic-purple/30">
                          <th className="text-left p-4 font-bold text-white border-r border-cosmic-purple/30 w-48">
                            {/* Empty header for features column */}
                          </th>
                          {program.accountSizes.map((size, index) => (
                            <th key={index} className="text-center p-3 font-bold text-white text-base border-r border-cosmic-purple/30 last:border-r-0 w-32">
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      
                      <tbody>
                        {/* Feature Rows */}
                        {program.tableData.map((row, rowIndex) => (
                          <React.Fragment key={rowIndex}>
                            {/* Main row with payout target values */}
                            <tr className="bg-gradient-to-r from-cosmic-card/80 via-cosmic-card/60 to-cosmic-card/80 border-b border-cosmic-purple/20">
                              <td className="p-4 font-bold text-white border-r border-cosmic-purple/30">
                                <div>
                                  {row.label}
                                  {row.subtitle && (
                                    <div className="text-sm font-normal text-cosmic-blue/80">{row.subtitle}</div>
                                  )}
                                </div>
                              </td>
                              {row.values.map((value, valueIndex) => (
                                <td key={valueIndex} className="text-center p-3 text-white border-r border-cosmic-purple/30 last:border-r-0 text-sm">
                                  {value}
                                </td>
                              ))}
                            </tr>
                            {/* Profit split sub-row */}
                            {row.profitSplit && (
                              <tr className="bg-gradient-to-r from-cosmic-card/60 via-cosmic-card/40 to-cosmic-card/60 border-b border-cosmic-purple/10">
                                <td className="border-r border-cosmic-purple/20 pl-8 py-2">
                                  <span className="text-sm text-cosmic-blue/70 italic">Profit Split</span>
                                </td>
                                <td colSpan={6} className="text-center py-2 font-medium text-cosmic-blue/80 text-sm">
                                  {row.profitSplit}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                        
                        {/* Price Row */}
                        <tr className="bg-gradient-to-r from-cosmic-purple/40 via-cosmic-blue/40 to-cosmic-purple/40 border-t-2 border-cosmic-purple/40">
                          <td className="p-4 font-bold text-white border-r border-cosmic-purple/30 text-lg">
                            Price
                          </td>
                          {program.prices.map((price, index) => (
                            <td key={index} className="text-center p-4 border-r border-cosmic-purple/30 last:border-r-0">
                              <span className="text-xl font-bold text-white">{price}</span>
                            </td>
                          ))}
                        </tr>
                        
                        {/* Buttons Row */}
                        <tr className="bg-cosmic-card/30">
                          <td className="p-4 border-r border-cosmic-purple/30">
                            {/* Empty cell for features column */}
                          </td>
                          {program.accountSizes.map((size, index) => (
                            <td key={index} className="text-center p-2 border-r border-cosmic-purple/30 last:border-r-0">
                              <Button 
                                size="sm"
                                onClick={() => handleGetFunded(program.programKey, program.accountValues[index])}
                                className="w-full text-xs py-2 px-2 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white shadow-cosmic transition-all duration-300 hover:scale-105"
                              >
                                Get Funded
                              </Button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default TradingPrograms;
