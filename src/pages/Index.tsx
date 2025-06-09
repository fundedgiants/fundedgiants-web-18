
import React from 'react';
import Hero from '../components/Hero';
import TradingPrograms from '../components/TradingPrograms';
import Features from '../components/Features';
import RulesSection from '../components/RulesSection';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TradingPrograms />
      <Features />
      <RulesSection />
      <Statistics />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
