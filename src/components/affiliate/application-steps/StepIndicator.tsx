
import React from 'react';
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex w-full items-center justify-between mb-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isActive
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-6 w-6" /> : step}
              </div>
              <p className={cn("mt-2 w-28 text-sm", isActive ? "font-semibold text-primary" : "text-muted-foreground")}>
                {label}
              </p>
            </div>
            {step < steps.length && (
              <div
                className={cn(
                  "flex-1 border-t-2 mx-4 transition-all duration-300",
                  isCompleted ? "border-primary" : "border-muted-foreground/30"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
