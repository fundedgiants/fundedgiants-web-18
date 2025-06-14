
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  steps: { id: number; name: string }[];
}

const CheckoutSteps = ({ currentStep, steps }: CheckoutStepsProps) => {
  return (
    <div className="flex justify-between items-center mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                currentStep > step.id ? 'bg-primary border-primary text-primary-foreground' :
                currentStep === step.id ? 'bg-primary/20 border-primary text-primary' :
                'bg-card border-border text-muted-foreground'
              )}
            >
              {currentStep > step.id ? <Check className="h-6 w-6" /> : <span className="font-bold text-lg">{step.id}</span>}
            </div>
            <p
              className={cn(
                'mt-2 text-sm text-center font-medium transition-colors duration-300',
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-1 mx-4 rounded-full transition-colors duration-500",
              currentStep > step.id ? 'bg-primary' : 'bg-border'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
