
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Users, Trophy, Zap, Shield, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background bg-stars">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      
      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            🌌 About FundedGiants 🌌
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            We are the divine realm where mortal traders ascend to godhood. Our mission is to unleash the trading titans within ambitious individuals, providing them with cosmic capital and celestial guidance.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-4xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Our Divine Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To forge a bridge between mortal ambition and divine prosperity. We believe every skilled trader deserves access to substantial capital and the freedom to pursue their trading destiny without the burden of personal financial risk.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/20 backdrop-blur-sm border-primary/30 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-4xl mb-6">🔮</div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Cosmic Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the ultimate pantheon of prop trading, where giants roam freely and profits flow like cosmic rivers. We envision a realm where talent meets opportunity in perfect divine harmony.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">⚡ Our Divine Values ⚡</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Transparency",
                description: "Clear rules, honest communication, and transparent profit sharing. No hidden fees or divine deceptions."
              },
              {
                icon: Zap,
                title: "Speed",
                description: "Lightning-fast evaluations, daily payouts, and 24-hour maximum payout processing."
              },
              {
                icon: Trophy,
                title: "Excellence",
                description: "We demand excellence and reward it generously. Only the finest traders join our cosmic pantheon."
              },
              {
                icon: Users,
                title: "Support",
                description: "Dedicated support from our divine council, helping you navigate your trading journey."
              },
              {
                icon: Target,
                title: "Innovation",
                description: "Cutting-edge technology and innovative trading programs that evolve with the markets."
              },
              {
                icon: Star,
                title: "Integrity",
                description: "Ethical business practices and fair treatment for all members of our trading realm."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-card/20 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-12 backdrop-blur-sm border border-primary/30">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">🏛️ Our Divine Achievements 🏛️</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">4K+</div>
                <div className="text-muted-foreground">Funded Traders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$200K</div>
                <div className="text-muted-foreground">Max Funding</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">$239K</div>
                <div className="text-muted-foreground">Total Payouts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24hrs</div>
                <div className="text-muted-foreground">Max Payout Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-primary">Ready to Join the Giants?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Begin your divine ascension today and trade with the power of the cosmic giants.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-xl font-bold">
            ⚔️ Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
