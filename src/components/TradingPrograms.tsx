
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TradingPrograms = () => {
  const programs = [
    {
      name: "Heracles Trader",
      subtitle: "Instant Funding",
      description: "Prove your divine trading prowess with our instant funding program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      prices: ["$129", "$239", "$449", "$1149", "$2299", "$4599"],
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
          label: "1st Payout Target",
          subtitle: "3 Min Trading Days",
          values: ["$250(10%)", "$500(10%)", "$1,000(10%)", "$2,500(10%)", "$5,000(10%)", "$10,000(10%)"],
          profitSplit: "50:50 Profit Split"
        },
        {
          label: "2nd Payout Target", 
          subtitle: "3 Min Trading Days",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          profitSplit: "60:40 Profit Split"
        },
        {
          label: "3rd Payout Target",
          subtitle: "3 Min Trading Days", 
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "Subsequent Payouts",
          values: ["Minimum 2% and On-Demand Daily Payouts at 70:30 Profit Split", "", "", "", "", ""],
          isSpanned: true
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
      name: "Orion Program",
      subtitle: "1 Step Challenge",
      description: "Navigate the trading cosmos with our premium 1-step challenge program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      prices: ["$59", "$89", "$149", "$249", "$449", "$749"],
      tableData: [
        {
          label: "Daily Drawdown",
          values: ["$100 (4%)", "$200 (4%)", "$400 (4%)", "$1,000 (4%)", "$2,000 (4%)", "$4,000 (4%)"]
        },
        {
          label: "Overall Drawdown",
          values: ["$200 (8%)", "$400 (8%)", "$800 (8%)", "$2000 (8%)", "$4000 (8%)", "$8000 (8%)"]
        },
        {
          label: "Profit Target Phase 1",
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"]
        },
        {
          label: "1st Payout Target",
          subtitle: "3 Min Trading Days",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "2nd Payout Target",
          subtitle: "3 Min Trading Days",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "Subsequent Payouts",
          values: ["Minimum 2% and On-Demand Daily Payouts at 70:30 Profit Split", "", "", "", "", ""],
          isSpanned: true
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
      name: "Zeus Program",
      subtitle: "2 Step Challenge",
      description: "Rule the markets like a god with our most prestigious 2-step challenge program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      prices: ["$27", "$47", "$87", "$187", "$367", "$567"],
      tableData: [
        {
          label: "Daily Drawdown",
          values: ["$100 (4%)", "$200 (4%)", "$400 (4%)", "$1,000 (4%)", "$2,000 (4%)", "$4,000 (4%)"]
        },
        {
          label: "Overall Drawdown",
          values: ["$200 (8%)", "$400 (8%)", "$800 (8%)", "$2000 (8%)", "$4000 (8%)", "$8000 (8%)"]
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
          label: "1st Payout Target",
          subtitle: "3 Min Trading Days",
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          profitSplit: "70:30 Profit Split"
        },
        {
          label: "Subsequent Payouts",
          values: ["Minimum 2% and On-Demand Daily Payouts at 70:30 Profit Split", "", "", "", "", ""],
          isSpanned: true
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
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-cosmic-card border border-cosmic-purple/30">
            <TabsTrigger 
              value="heracles" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              Heracles Trader
            </TabsTrigger>
            <TabsTrigger 
              value="orion"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              Orion Program
            </TabsTrigger>
            <TabsTrigger 
              value="zeus"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              Zeus Program
            </TabsTrigger>
          </TabsList>

          {programs.map((program, programIndex) => (
            <TabsContent 
              key={program.name.toLowerCase().replace(' ', '')} 
              value={programIndex === 0 ? 'heracles' : programIndex === 1 ? 'orion' : 'zeus'}
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
                        <tr className="bg-gradient-to-r from-primary via-accent to-primary">
                          <th className="text-left p-4 font-bold text-white border-r border-primary/30">
                            {/* Empty header for features column */}
                          </th>
                          {program.accountSizes.map((size, index) => (
                            <th key={index} className="text-center p-4 font-bold text-white text-lg border-r border-primary/30 last:border-r-0">
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      
                      <tbody>
                        {/* Feature Rows */}
                        {program.tableData.map((row, rowIndex) => (
                          <React.Fragment key={rowIndex}>
                            <tr className="bg-gradient-to-r from-primary/80 via-accent/80 to-primary/80 border-b border-primary/20">
                              <td className="p-4 font-bold text-white border-r border-primary/30">
                                <div>
                                  {row.label}
                                  {row.subtitle && (
                                    <div className="text-sm font-normal">{row.subtitle}</div>
                                  )}
                                </div>
                              </td>
                              {row.isSpanned ? (
                                <td colSpan={6} className="text-center p-4 font-semibold text-white">
                                  {row.values[0]}
                                </td>
                              ) : (
                                row.values.map((value, valueIndex) => (
                                  <td key={valueIndex} className="text-center p-4 text-white border-r border-primary/30 last:border-r-0">
                                    {value}
                                  </td>
                                ))
                              )}
                            </tr>
                            {row.profitSplit && (
                              <tr className="bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60">
                                <td className="border-r border-primary/20"></td>
                                <td colSpan={6} className="text-center p-2 font-semibold text-white">
                                  {row.profitSplit}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                        
                        {/* Price Row */}
                        <tr className="bg-gradient-to-r from-primary via-accent to-primary border-t-2 border-primary/40">
                          <td className="p-4 font-bold text-white border-r border-primary/30 text-lg">
                            Price
                          </td>
                          {program.prices.map((price, index) => (
                            <td key={index} className="text-center p-4 border-r border-primary/30 last:border-r-0">
                              <span className="text-2xl font-bold text-white">{price}</span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Buttons Row */}
                    <div className="flex mt-6 bg-cosmic-card/30 rounded-b-lg border border-t-0 border-cosmic-purple/30">
                      <div className="w-[200px]"></div> {/* Empty space for features column */}
                      <div className="flex flex-1">
                        {program.accountSizes.map((size, index) => (
                          <div key={index} className="flex-1 px-2 py-4">
                            <Button className="w-full text-sm py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white shadow-cosmic transition-all duration-300 hover:scale-105">
                              Get Funded
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
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
