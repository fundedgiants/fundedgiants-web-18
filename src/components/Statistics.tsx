
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Statistics = () => {
  const [stats, setStats] = useState([
    { number: "4K", label: "Funded Traders", suffix: "+" },
    { number: "200K", label: "Max Funding", suffix: "" },
    { number: "239K", label: "Total Payouts", suffix: "" },
    { number: "24", label: "Hours Max Payout", suffix: "" }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Our Track Record
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak for our commitment to trader success
          </p>
          
          <Button 
            onClick={() => setIsEditing(!isEditing)} 
            variant="ghost" 
            size="sm"
            className="absolute top-0 right-0 opacity-50 hover:opacity-100"
          >
            {isEditing ? 'Save Stats' : 'Edit Stats'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].number = e.target.value;
                        setStats(newStats);
                      }}
                      className="w-full text-3xl md:text-4xl font-bold text-primary text-center bg-transparent border-b border-primary/50 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].suffix = e.target.value;
                        setStats(newStats);
                      }}
                      className="w-full text-primary text-center bg-transparent border-b border-primary/30 focus:outline-none"
                      placeholder="Suffix"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].label = e.target.value;
                        setStats(newStats);
                      }}
                      className="w-full text-muted-foreground text-center bg-transparent border-b border-muted focus:outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {index === 1 ? '$' : ''}{stat.number}{stat.suffix}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
