
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const TradingPrograms = () => {
  const [activeProgram, setActiveProgram] = useState(0);

  const programs = [
    {
      name: "Heracles Trader",
      subtitle: "Instant Funding",
      description: "Prove your divine trading prowess with our instant funding program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      prices: ["$129", "$239", "$449", "$1149", "$2299", "$4599"],
      features: [
        { 
          name: "Profit Target For Withdrawals", 
          values: ["", "", "", "", "", ""],
          isMainRow: true,
          hasSubRows: true
        },
        { 
          name: "1st", 
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2500 (10%)", "$5000 (10%)", "$10,000 (10%)"],
          isSubRow: true,
          parentRow: "Profit Target For Withdrawals"
        },
        { 
          name: "2nd", 
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5000 (5%)"],
          isSubRow: true,
          parentRow: "Profit Target For Withdrawals"
        },
        { 
          name: "3rd", 
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5000 (5%)"],
          isSubRow: true,
          parentRow: "Profit Target For Withdrawals"
        },
        { 
          name: "Daily DrawDown", 
          values: ["$100 (4%)", "$200 (4%)", "$400 (4%)", "$1000 (4%)", "$2000 (4%)", "$4000 (4%)"] 
        },
        { 
          name: "Overall Drawdown", 
          values: ["$175 (7%)", "$350 (7%)", "$700 (7%)", "$1750 (7%)", "$3500 (7%)", "$7000 (7%)"] 
        },
        { 
          name: "Minimum Number of Trading Days", 
          values: ["3", "3", "3", "3", "3", "3"] 
        },
        { 
          name: "Max Number of Trading Days", 
          values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"] 
        },
        { 
          name: "Profit Split", 
          values: ["", "", "", "", "", ""],
          isMainRow: true,
          hasSubRows: true
        },
        { 
          name: "1st", 
          values: ["50:50", "50:50", "50:50", "50:50", "50:50", "50:50"],
          isSubRow: true,
          parentRow: "Profit Split"
        },
        { 
          name: "2nd", 
          values: ["60:40", "60:40", "60:40", "60:40", "60:40", "60:40"],
          isSubRow: true,
          parentRow: "Profit Split"
        },
        { 
          name: "3rd", 
          values: ["70:30", "70:30", "70:30", "70:30", "70:30", "70:30"],
          isSubRow: true,
          parentRow: "Profit Split"
        },
        { 
          name: "Available Leverage", 
          values: ["1:30", "1:30", "1:30", "1:30", "1:30", "1:30"] 
        },
        { 
          name: "Fee Refund", 
          values: ["No", "No", "No", "No", "No", "No"] 
        }
      ]
    },
    {
      name: "Orion Program",
      subtitle: "1 Step Challenge",
      description: "Navigate the trading cosmos with our premium 1-step challenge program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      prices: ["$59", "$89", "$149", "$249", "$449", "$749"],
      features: [
        { 
          name: "Profit Target Phase 1", 
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"] 
        },
        { 
          name: "Daily D.D", 
          values: ["$100 (4%)", "$200 (4%)", "$400 (4%)", "$1000 (4%)", "$2000 (4%)", "$4000 (4%)"] 
        },
        { 
          name: "Overall D.D", 
          values: ["$200 (8%)", "$400 (8%)", "$800 (8%)", "$2000 (8%)", "$4000 (8%)", "$8000 (8%)"] 
        },
        { 
          name: "Profit Target For Payouts", 
          values: ["", "", "", "", "", ""],
          isMainRow: true,
          hasSubRows: true
        },
        { 
          name: "1st", 
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          isSubRow: true,
          parentRow: "Profit Target For Payouts"
        },
        { 
          name: "2nd", 
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"],
          isSubRow: true,
          parentRow: "Profit Target For Payouts"
        },
        { 
          name: "Max Number of Trading Days", 
          values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"] 
        },
        { 
          name: "Profit Split", 
          values: ["70:30", "70:30", "70:30", "70:30", "70:30", "70:30"] 
        },
        { 
          name: "Available Leverage", 
          values: ["1:30", "1:30", "1:30", "1:30", "1:30", "1:30"] 
        }
      ]
    },
    {
      name: "Zeus Program",
      subtitle: "2 Step Challenge",
      description: "Rule the markets like a god with our most prestigious 2-step challenge program.",
      accountSizes: ["$2,500", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000"],
      prices: ["$27", "$47", "$87", "$187", "$367", "$567"],
      features: [
        { 
          name: "Profit Target Phase 1", 
          values: ["$250 (10%)", "$500 (10%)", "$1,000 (10%)", "$2,500 (10%)", "$5,000 (10%)", "$10,000 (10%)"] 
        },
        { 
          name: "Profit Target Phase 2", 
          values: ["$125 (5%)", "$250 (5%)", "$750 (5%)", "$1,250 (5%)", "$2,500 (5%)", "$5,000 (5%)"] 
        },
        { 
          name: "Daily D.D", 
          values: ["$100 (4%)", "$200 (4%)", "$400 (4%)", "$1000 (4%)", "$2000 (4%)", "$4000 (4%)"] 
        },
        { 
          name: "Overall D.D", 
          values: ["$200 (8%)", "$400 (8%)", "$800 (8%)", "$2000 (8%)", "$4000 (8%)", "$8000 (8%)"] 
        },
        { 
          name: "Profit Target For 1st Payout", 
          values: ["$125 (5%)", "$250 (5%)", "$500 (5%)", "$1250 (5%)", "$2500 (5%)", "$5,000 (5%)"] 
        },
        { 
          name: "Profit Target for Subsequent Payouts", 
          values: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"] 
        },
        { 
          name: "Minimum Number of Trading Days Per Phase", 
          values: ["3", "3", "3", "3", "3", "3"] 
        },
        { 
          name: "Max Number of Trading Days", 
          values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited", "Unlimited"] 
        },
        { 
          name: "Profit Split", 
          values: ["70:30", "70:30", "70:30", "70:30", "70:30", "70:30"] 
        },
        { 
          name: "Available Leverage", 
          values: ["1:30", "1:30", "1:30", "1:30", "1:30", "1:30"] 
        }
      ]
    }
  ];

  const currentProgram = programs[activeProgram];

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

        {/* Program Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {programs.map((program, index) => (
            <Button
              key={index}
              onClick={() => setActiveProgram(index)}
              variant={activeProgram === index ? "default" : "outline"}
              className={`px-6 py-3 ${
                activeProgram === index 
                  ? "bg-cosmic-purple text-white shadow-cosmic" 
                  : "border-cosmic-purple/30 text-cosmic-blue hover:bg-cosmic-purple/10"
              }`}
            >
              {program.name}
            </Button>
          ))}
        </div>

        {/* Program Details */}
        <Card className="max-w-7xl mx-auto bg-cosmic-card border-cosmic-purple/30 shadow-cosmic backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-cosmic-blue mb-2">
              {currentProgram.name}
            </CardTitle>
            <p className="text-xl text-cosmic-purple font-semibold mb-4">
              {currentProgram.subtitle}
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {currentProgram.description}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                {/* Account Size Headers */}
                <thead>
                  <tr className="border-b border-cosmic-purple/30">
                    <th className="text-left p-4 w-56 text-cosmic-blue font-bold">
                      {/* Empty header for features column */}
                    </th>
                    {currentProgram.accountSizes.map((size, index) => (
                      <th key={index} className="text-center p-4 w-36 text-cosmic-blue font-bold text-lg">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {/* Feature Rows */}
                  {currentProgram.features.map((feature, featureIndex) => (
                    <tr key={featureIndex} className={`border-b border-cosmic-purple/20 hover:bg-cosmic-purple/5 transition-colors ${
                      feature.isMainRow ? 'bg-cosmic-purple/10 font-semibold' : ''
                    } ${
                      feature.isSubRow ? 'bg-cosmic-purple/5' : ''
                    }`}>
                      <td className={`p-4 ${feature.isSubRow ? 'text-sm' : 'font-semibold'} text-cosmic-blue border-r border-cosmic-purple/20 w-56 ${
                        feature.isSubRow ? 'relative' : ''
                      }`}>
                        {feature.isSubRow ? (
                          <div className="flex items-center">
                            <div className="w-6 h-6 flex items-center justify-center bg-cosmic-purple/20 rounded text-xs font-bold text-cosmic-purple mr-2">
                              {feature.name}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {feature.name === "1st" ? "Withdrawal" : feature.name === "2nd" ? "Withdrawal" : feature.name === "3rd" ? "Withdrawal" : ""}
                            </span>
                          </div>
                        ) : (
                          feature.name
                        )}
                      </td>
                      {feature.values.map((value, valueIndex) => (
                        <td key={valueIndex} className={`text-center p-4 ${feature.isSubRow ? 'text-sm' : ''} text-muted-foreground w-36`}>
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Price Row */}
                  <tr className="border-b-2 border-cosmic-purple/30 bg-cosmic-purple/10">
                    <td className="p-4 font-bold text-cosmic-blue border-r border-cosmic-purple/20 text-lg w-56">
                      Price
                    </td>
                    {currentProgram.prices.map((price, index) => (
                      <td key={index} className="text-center p-4 w-36">
                        <span className="text-2xl font-bold text-cosmic-purple">{price}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              
              {/* Buttons Row */}
              <div className="flex mt-6">
                <div className="w-56"></div> {/* Empty space for features column */}
                {currentProgram.accountSizes.map((size, index) => (
                  <div key={index} className="w-36 px-1">
                    <Button className="w-full text-xs py-2 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white shadow-cosmic transition-all duration-300 hover:scale-105">
                      Get Funded
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TradingPrograms;
