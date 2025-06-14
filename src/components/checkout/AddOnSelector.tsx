
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { AddOn } from '@/data/checkoutData';

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggleAddOn: (addOnId: string) => void;
}

const AddOnSelector = ({ addOns, selectedAddOns, onToggleAddOn }: AddOnSelectorProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">Customize Your Plan</h2>
      <div className="space-y-4">
        {addOns.map((addOn) => (
          <Card key={addOn.id} className="p-6 flex items-start space-x-6">
            <Checkbox
              id={addOn.id}
              checked={selectedAddOns.includes(addOn.id)}
              onCheckedChange={() => onToggleAddOn(addOn.id)}
              className="mt-1 h-5 w-5"
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={addOn.id} className="text-lg font-semibold cursor-pointer">
                {addOn.name} <span className="text-primary font-bold">(+{addOn.pricePercent}%)</span>
              </Label>
              <p className="text-sm text-muted-foreground">{addOn.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddOnSelector;
