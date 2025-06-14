
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

import { programs, addOns, steps } from '@/data/checkoutData';
import type { Program } from '@/data/checkoutData';

import CheckoutSteps from './checkout/CheckoutSteps';
import ProgramSelector from './checkout/ProgramSelector';
import AddOnSelector from './checkout/AddOnSelector';
import OrderSummary from './checkout/OrderSummary';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(programs[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!selectedProgram) {
      setTotalPrice(0);
      return;
    }

    let calculatedPrice = selectedProgram.price;
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        calculatedPrice += selectedProgram.price * (addOn.pricePercent / 100);
      }
    });

    setTotalPrice(calculatedPrice);
  }, [selectedProgram, selectedAddOns]);

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedProgram) {
      toast.error('Please select a program before proceeding.');
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePayment = () => {
    console.log('Processing payment for:', {
      program: selectedProgram?.name,
      addOns: selectedAddOns,
      total: totalPrice
    });
    toast.success('Payment processed successfully! Your journey begins.');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <CheckoutSteps currentStep={currentStep} steps={steps} />

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ProgramSelector
                programs={programs}
                selectedProgram={selectedProgram}
                onSelectProgram={setSelectedProgram}
              />
            )}
            {currentStep === 2 && (
              <AddOnSelector
                addOns={addOns}
                selectedAddOns={selectedAddOns}
                onToggleAddOn={handleToggleAddOn}
              />
            )}
            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-center mb-8 text-primary">Confirm Your Order</h2>
                <div className="bg-card p-8 rounded-lg border border-border">
                  <p>You are about to purchase the <span className="font-bold text-primary">{selectedProgram?.name}</span> package.</p>
                  <p className="mt-4">Please review your order on the right and proceed to payment.</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <OrderSummary
              selectedProgram={selectedProgram}
              selectedAddOns={selectedAddOns}
              addOnsData={addOns}
              totalPrice={totalPrice}
            />

            <div className="mt-8 flex gap-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="w-full">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700">
                  Pay Now <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
