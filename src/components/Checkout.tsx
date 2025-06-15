import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAffiliateContext } from '@/contexts/AffiliateContext';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

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
  const { affiliateCode: affiliateCodeFromUrl } = useAffiliateContext();

  const [promoCode, setPromoCode] = useState(affiliateCodeFromUrl || '');
  
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{ amount: number; code: string | null }>({ amount: 0, code: null });
  const [affiliateCodeToTie, setAffiliateCodeToTie] = useState<string | null>(affiliateCodeFromUrl);

  const selectedAddons = addons.filter(addon => addon.selected);
  const addonsTotal = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
  const initialTotalPrice = programPrice + addonsTotal;
  const finalPrice = initialTotalPrice - appliedDiscount.amount;

  const handleApplyCode = async () => {
    if (!promoCode) return;
    setIsApplyingCode(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-and-apply-codes', {
        body: {
          totalInitialPrice: initialTotalPrice,
          discountCode: promoCode,
          affiliateCode: promoCode,
        }
      });

      if (error) throw error;
      
      setAppliedDiscount({ amount: data.discountAmount, code: data.appliedDiscountCode });
      if (data.affiliateCodeToTie) {
        setAffiliateCodeToTie(data.affiliateCodeToTie);
      }

      toast({
        title: 'Code Processed',
        description: data.message,
      });

    } catch (err: any) {
      toast({
        title: "Error applying code",
        description: err.message,
        variant: 'destructive'
      });
      setAppliedDiscount({ amount: 0, code: null });
    } finally {
      setIsApplyingCode(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);

    if (!user) {
      toast({
        title: 'Not authenticated.',
        description: 'You must be logged in to complete the purchase.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const functionName = `create-${paymentMethod}-checkout-session`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          programId,
          programName,
          programPrice,
          totalPrice: finalPrice,
          selectedAddons,
          userId: user.id,
          email: user.email,
          affiliateCode: affiliateCodeToTie, // Pass the final affiliate code
          appliedDiscountCode: appliedDiscount.code, // Pass the code that gave the discount
          discountAmount: appliedDiscount.amount // Pass the discount amount
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
        <CardDescription>Confirm your purchase details and apply any codes before proceeding.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{programName}</span>
            <span>${programPrice.toFixed(2)}</span>
          </div>
          {selectedAddons.map(addon => (
            <div key={addon.id} className="flex justify-between text-sm text-muted-foreground">
              <span>+ {addon.name}</span>
              <span>${addon.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-2">
          <label htmlFor="promo-code" className="text-sm font-medium">Discount or Affiliate Code</label>
          <div className="flex gap-2">
            <Input id="promo-code" placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
            <Button variant="outline" onClick={handleApplyCode} disabled={isApplyingCode || !promoCode}>
              {isApplyingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </Button>
          </div>
          {affiliateCodeToTie && !appliedDiscount.code && (
            <p className="text-sm text-muted-foreground pt-2">
              Affiliate code <span className="font-semibold text-primary">{affiliateCodeToTie}</span> will be applied.
            </p>
          )}
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${initialTotalPrice.toFixed(2)}</span>
          </div>
          {appliedDiscount.amount > 0 && (
             <div className="flex justify-between text-green-600">
               <span>Discount ({appliedDiscount.code})</span>
               <span>-${appliedDiscount.amount.toFixed(2)}</span>
             </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckout} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Proceed to Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Checkout;
