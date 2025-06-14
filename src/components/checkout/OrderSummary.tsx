
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Program, AddOn } from '@/data/checkoutData';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

interface OrderSummaryProps {
  selectedProgram: Program | null;
  selectedAddOns: string[];
  addOnsData: AddOn[];
  totalPrice: number;
}

const OrderSummary = ({ selectedProgram, selectedAddOns, addOnsData, totalPrice }: OrderSummaryProps) => {
  if (!selectedProgram) {
    return (
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a program to see the summary.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between">
            <p className="font-semibold">{selectedProgram.name}</p>
            <p>{formatCurrency(selectedProgram.price)}</p>
          </div>
          <p className="text-sm text-muted-foreground">{selectedProgram.size} Account</p>
        </div>

        {selectedAddOns.length > 0 && <Separator />}

        <div className="space-y-2">
          {addOnsData
            .filter(addOn => selectedAddOns.includes(addOn.id))
            .map(addOn => {
              const addOnPrice = selectedProgram.price * (addOn.pricePercent / 100);
              return (
                <div key={addOn.id} className="flex justify-between">
                  <p className="text-sm text-muted-foreground">{addOn.name}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(addOnPrice)}</p>
                </div>
              );
            })}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
