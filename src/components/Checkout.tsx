
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { programs, addOns, steps as defaultSteps, stepsWithAuth } from '@/data/checkoutData';
import type { Program } from '@/data/checkoutData';

import CheckoutSteps from './checkout/CheckoutSteps';
import ProgramSelector from './checkout/ProgramSelector';
import AddOnSelector from './checkout/AddOnSelector';
import OrderSummary from './checkout/OrderSummary';
import Auth from '@/components/Auth';

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(programs[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = user ? defaultSteps : stepsWithAuth;
  const payStep = user ? 3 : 4;
  const authStep = user ? -1 : 3;

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

  useEffect(() => {
    if (user && currentStep === authStep) {
      setCurrentStep(payStep);
    }
  }, [user, currentStep, authStep, payStep]);

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
  
  const handleAuthSuccess = () => {
    nextStep();
  }

  const handlePayment = async () => {
    if (!user || !selectedProgram) {
      toast.error("You must be signed in and have a program selected to continue.");
      if (!user) {
        setCurrentStep(authStep);
      }
      return;
    }
    setIsProcessing(true);
    
    const selectedAddOnsData = addOns.filter(a => selectedAddOns.includes(a.id));

    const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        program_id: selectedProgram.id,
        program_name: selectedProgram.name,
        program_price: selectedProgram.price,
        selected_addons: selectedAddOnsData,
        total_price: totalPrice,
    });

    if (error) {
        toast.error(`Error saving your order: ${error.message}`);
        setIsProcessing(false);
        return;
    }
    
    console.log('Processing payment for:', {
      user: user.email,
      program: selectedProgram?.name,
      addOns: selectedAddOnsData.map(a => a.name),
      total: totalPrice
    });
    toast.success('Order placed successfully! Simulating payment...');

    setTimeout(() => {
        toast.success('Payment processed successfully! Your journey begins.');
        setIsProcessing(false);
    }, 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
            {currentStep === authStep && (
               <div>
                <h2 className="text-3xl font-bold text-center mb-8 text-primary">Account Signup / Login</h2>
                <Auth onAuthSuccess={handleAuthSuccess} className="mx-auto border bg-card" />
              </div>
            )}
            {currentStep === payStep && (
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
                <Button variant="outline" onClick={prevStep} className="w-full" disabled={isProcessing}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="w-full" disabled={isProcessing}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                   {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="ml-2 h-4 w-4" />}
                   {isProcessing ? 'Processing...' : `Pay Now`}
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
