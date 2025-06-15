import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAffiliateContext } from '@/contexts/AffiliateContext'; // Import the context hook

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

interface CheckoutProps {
  programId: string;
  programName: string;
  programPrice: number;
  addons: Addon[];
  onPaymentSuccess: () => void;
}

const Checkout = ({ programId, programName, programPrice, addons, onPaymentSuccess }: CheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { affiliateCode } = useAffiliateContext(); // Get affiliate code from context

  const selectedAddons = addons.filter(addon => addon.selected);
  const addonsTotal = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
  const totalPrice = programPrice + addonsTotal;

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!user) {
      toast({
        title: 'Not authenticated.',
        description: 'You must be logged in to complete the purchase.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const functionName = `create-${paymentMethod}-checkout-session`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          programId,
          programName,
          programPrice,
          totalPrice,
          selectedAddons,
          userId: user.id,
          email: user.email,
          affiliateCode, // Pass affiliate code to the edge function
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received.');
      }
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description: `Could not initiate checkout: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
        <CardDescription>Please confirm your purchase details before proceeding.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Program:</span>
            <span>{programName}</span>
          </div>
          <div className="flex justify-between">
            <span>Program Price:</span>
            <span>${programPrice.toFixed(2)}</span>
          </div>
          {selectedAddons.map(addon => (
            <div key={addon.id} className="flex justify-between">
              <span>{addon.name} (Addon):</span>
              <span>${addon.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckout} disabled={isLoading} className="w-full">
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Checkout;
