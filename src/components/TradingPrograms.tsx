import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const TradingPrograms = () => {
  const [activeProgram, setActiveProgram] = useState(0);

  const programs = [
    {
      name: "Heracles Trader",
      subtitle: "The Divine Strength Program",
      description: "Prove your divine trading prowess with our most popular evaluation program.",
      accountSizes: ["$25,000", "$50,000", "$100,000"],
      prices: ["$89", "$169", "$289"],
      features: [
        { name: "Profit Target", values: ["10%", "10%", "10%"] },
        { name: "Daily Drawdown", values: ["5%", "5%", "5%"] },
        { name: "Max Drawdown", values: ["10%", "10%", "10%"] },
        { name: "Trading Period", values: ["Unlimited", "Unlimited", "Unlimited"] },
        { name: "Profit Split", values: ["70%", "70%", "70%"] },
        { name: "Refund Fee", values: ["Yes", "Yes", "Yes"] }
      ]
    },
    {
      name: "Orion Program",
      subtitle: "The Cosmic Explorer Path",
      description: "Navigate the trading cosmos with our premium program featuring enhanced conditions.",
      accountSizes: ["$25,000", "$50,000", "$100,000"],
      prices: ["$129", "$229", "$389"],
      features: [
        { name: "Profit Target", values: ["8%", "8%", "8%"] },
        { name: "Daily Drawdown", values: ["6%", "6%", "6%"] },
        { name: "Max Drawdown", values: ["12%", "12%", "12%"] },
        { name: "Trading Period", values: ["Unlimited", "Unlimited", "Unlimited"] },
        { name: "Profit Split", values: ["75%", "75%", "75%"] },
        { name: "Refund Fee", values: ["Yes", "Yes", "Yes"] }
      ]
    },
    {
      name: "Zeus Program",
      subtitle: "The Supreme Godly Challenge",
      description: "Rule the markets like a god with our most prestigious instant funding program.",
      accountSizes: ["$25,000", "$50,000", "$100,000"],
      prices: ["$189", "$339", "$589"],
      features: [
        { name: "Profit Target", values: ["No Target", "No Target", "No Target"] },
        { name: "Daily Drawdown", values: ["3%", "3%", "3%"] },
        { name: "Max Drawdown", values: ["6%", "6%", "6%"] },
        { name: "Trading Period", values: ["Instant Funding", "Instant Funding", "Instant Funding"] },
        { name: "Profit Split", values: ["80%", "80%", "80%"] },
        { name: "Refund Fee", values: ["No", "No", "No"] }
      ]
    }
  ];

  const currentProgram = programs[activeProgram];

  return (
    <section id="programs" className="py-20 bg-galactic-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Our Trading Programs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our range of trading programs designed to fit your style and
            ambition
          </p>
        </div>
      </div>

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
        <Card className="max-w-6xl mx-auto bg-cosmic-card border-cosmic-purple/30 shadow-cosmic backdrop-blur-sm">
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
                    <th className="text-left p-4 w-48 text-cosmic-blue font-bold">
                      {/* Empty header for features column */}
                    </th>
                    {currentProgram.accountSizes.map((size, index) => (
                      <th key={index} className="text-center p-4 w-52 text-cosmic-blue font-bold text-lg">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {/* Feature Rows */}
                  {currentProgram.features.map((feature, featureIndex) => (
                    <tr key={featureIndex} className="border-b border-cosmic-purple/20 hover:bg-cosmic-purple/5 transition-colors">
                      <td className="p-4 font-semibold text-cosmic-blue border-r border-cosmic-purple/20">
                        {feature.name}
                      </td>
                      {feature.values.map((value, valueIndex) => (
                        <td key={valueIndex} className="text-center p-4 text-muted-foreground">
                          {feature.name === "Refund Fee" ? (
                            value === "Yes" ? (
                              <Check className="h-5 w-5 text-cosmic-green mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-cosmic-red mx-auto" />
                            )
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Price Row */}
                  <tr className="border-b-2 border-cosmic-purple/30 bg-cosmic-purple/10">
                    <td className="p-4 font-bold text-cosmic-blue border-r border-cosmic-purple/20 text-lg">
                      Price
                    </td>
                    {currentProgram.prices.map((price, index) => (
                      <td key={index} className="text-center p-4">
                        <span className="text-2xl font-bold text-cosmic-purple">{price}</span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              
              {/* Buttons Row */}
              <div className="grid grid-cols-4 gap-0 mt-6">
                <div className="w-48"></div> {/* Empty space for features column */}
                {currentProgram.accountSizes.map((size, index) => (
                  <div key={index} className="flex justify-center px-2">
                    <Button className="w-full max-w-44 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white shadow-cosmic transition-all duration-300 hover:scale-105">
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
