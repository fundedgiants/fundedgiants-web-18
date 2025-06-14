
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Auth from '@/components/Auth';
import type { Json } from '@/integrations/supabase/types';

// Data interfaces
export interface Program {
    id: string;
    name: string;
    description: string;
    price: number;
    size: string;
}

export interface AddOn {
    id:string;
    name: string;
    description: string;
    pricePercent: number;
}

// Data definitions
export const programs: Program[] = [
    { id: 'stellar', name: 'Stellar Account', description: 'Beginner-friendly, perfect for starting out.', price: 150, size: '25K' },
    { id: 'galaxy', name: 'Galaxy Account', description: 'For experienced traders ready to scale up.', price: 300, size: '50K' },
    { id: 'universe', name: 'Universe Account', description: 'The ultimate account for professional traders.', price: 550, size: '100K' }
];

export const addOns: AddOn[] = [
    { id: 'leverage', name: 'Increase Leverage to 1:50', description: 'Boost your trading power with higher leverage.', pricePercent: 20 },
    { id: 'drawdown', name: 'Increase DrawDown by 2%', description: 'Get more room for your trades to breathe.', pricePercent: 20 },
    { id: 'no_profit_target', name: 'Remove Profit Target from 1st, 2nd, and 3rd Withdrawals', description: 'Removes profit targets and minimum trading days for your first 3 payouts.', pricePercent: 30 },
    { id: 'profit_split', name: 'Increase Profit Split (80:20 from onset)', description: 'Enjoy an 80:20 profit split from the very beginning.', pricePercent: 50 }
];

export const steps = [
    { id: 1, name: 'Choose Program' },
    { id: 2, name: 'Select Add-ons' },
    { id: 3, name: 'Confirm & Pay' }
];

export const stepsWithAuth = [
    { id: 1, name: 'Choose Program' },
    { id: 2, name: 'Select Add-ons' },
    { id: 3, name: 'Account' },
    { id: 4, name: 'Confirm & Pay' }
];

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(programs[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const stepsToUse = user ? steps : stepsWithAuth;
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
    if (currentStep < stepsToUse.length) {
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
        selected_addons: selectedAddOnsData as unknown as Json,
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

  const CheckoutStepsComponent = () => (
    <div className="mb-16">
        <div className="flex items-center justify-center">
            {stepsToUse.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                                currentStep > step.id ? 'bg-green-500 text-white' :
                                currentStep === step.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            )}
                        >
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <p className="mt-2 text-sm text-center font-medium">{step.name}</p>
                    </div>
                    {index < stepsToUse.length - 1 && (
                        <div className={cn(
                            'flex-1 h-1 mx-4',
                            currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                        )}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
  );
  
  const ProgramSelectorComponent = () => (
      <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Choose Your Program</h2>
          <div className="grid md:grid-cols-3 gap-6">
              {programs.map(program => (
                  <Card
                      key={program.id}
                      className={cn(
                          'cursor-pointer border-2 hover:border-primary transition-all',
                          selectedProgram?.id === program.id ? 'border-primary shadow-lg' : 'border-border'
                      )}
                      onClick={() => setSelectedProgram(program)}
                  >
                      <CardHeader>
                          <CardTitle className="text-xl">{program.name}</CardTitle>
                          <p className="text-3xl font-bold text-primary">${program.price}</p>
                      </CardHeader>
                      <CardContent>
                          <p className="text-lg font-semibold">{program.size} Account</p>
                          <p className="text-sm text-muted-foreground mt-2">{program.description}</p>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </div>
  );

  const AddOnSelectorComponent = () => (
      <div>
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Select Your Add-ons</h2>
          <div className="space-y-4">
              {addOns.map(addOn => (
                  <div
                      key={addOn.id}
                      className={cn(
                          'flex items-start p-4 rounded-lg border cursor-pointer transition-all',
                          selectedAddOns.includes(addOn.id) ? 'border-primary bg-muted' : 'border-border'
                      )}
                      onClick={() => handleToggleAddOn(addOn.id)}
                  >
                      <Checkbox
                          checked={selectedAddOns.includes(addOn.id)}
                          onCheckedChange={() => handleToggleAddOn(addOn.id)}
                          className="mt-1"
                      />
                      <div className="ml-4">
                          <h3 className="font-semibold">{addOn.name}</h3>
                          <p className="text-sm text-muted-foreground">{addOn.description}</p>
                          <p className="text-sm font-bold text-primary mt-1">
                              +{addOn.pricePercent}%
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const OrderSummaryComponent = () => {
    const programPrice = selectedProgram?.price || 0;
    
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                {!selectedProgram ? (
                    <p className="text-muted-foreground">Select a program to see your summary.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between font-semibold">
                            <span>{selectedProgram.name}</span>
                            <span>${programPrice.toFixed(2)}</span>
                        </div>
                        {selectedAddOns.length > 0 && (
                            <div className="border-t pt-4 mt-4 space-y-2">
                                <h4 className="font-semibold">Add-ons:</h4>
                                {selectedAddOns.map(addOnId => {
                                    const addOn = addOns.find(a => a.id === addOnId);
                                    if (!addOn) return null;
                                    const addOnCost = selectedProgram.price * (addOn.pricePercent / 100);
                                    return (
                                        <div key={addOnId} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{addOn.name}</span>
                                            <span>+${addOnCost.toFixed(2)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <CheckoutStepsComponent />

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {currentStep === 1 && <ProgramSelectorComponent />}
            {currentStep === 2 && <AddOnSelectorComponent />}
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
            <OrderSummaryComponent />

            <div className="mt-8 flex gap-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="w-full" disabled={isProcessing}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              {currentStep < stepsToUse.length ? (
                <Button onClick={nextStep} className="w-full" disabled={isProcessing}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                   {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
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
