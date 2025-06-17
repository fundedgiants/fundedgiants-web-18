
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background bg-stars">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="text-6xl mb-4">⚡</div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Become a Trading Giant
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform into a legendary trader with our divine funding programs. 
            Access instant capital, real markets, and ascend to trading godhood.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg group" asChild>
              <Link to="/checkout">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg" asChild>
              <Link to="/affiliate-program">
                Earn as Affiliate
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-card/20 backdrop-blur-sm rounded-lg border border-primary/20">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Instant Funding</h3>
              <p className="text-muted-foreground text-center">Get trading capital immediately with our Heracles program</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card/20 backdrop-blur-sm rounded-lg border border-primary/20">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Risk Protection</h3>
              <p className="text-muted-foreground text-center">Trade with confidence knowing your capital is protected</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-card/20 backdrop-blur-sm rounded-lg border border-primary/20">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Divine Tools</h3>
              <p className="text-muted-foreground text-center">Access professional trading platforms and real market data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
