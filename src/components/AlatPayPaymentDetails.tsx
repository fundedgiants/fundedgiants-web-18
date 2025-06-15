
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AlatPayDetails {
  account_name: string;
  account_number: string;
  bank_name: string;
  amount_expected: number;
  reference: string;
}

interface AlatPayPaymentDetailsProps {
  details: AlatPayDetails;
  orderId: string;
}

export const AlatPayPaymentDetails: React.FC<AlatPayPaymentDetailsProps> = ({ details, orderId }) => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${field} copied to clipboard!`);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const { data: orderStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ['orderStatus', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('payment_status')
        .eq('id', orderId)
        .single();
      
      if (error) throw new Error(error.message);
      return data?.payment_status;
    },
    refetchInterval: 5000,
    enabled: !!orderId,
  });

  React.useEffect(() => {
    if (orderStatus === 'succeeded') {
      toast.success('Payment confirmed!');
      navigate(`/payment-success?reference=${orderId}`);
    } else if (orderStatus === 'failed') {
        toast.error('Payment failed or expired. Please try again.');
    }
  }, [orderStatus, navigate, orderId]);

  const DetailItem = ({ label, value, field }: { label: string; value: string | number; field: string }) => (
    <div className="flex justify-between items-center py-3">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-white font-medium">{value}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => copyToClipboard(String(value), field)}
        >
          {copiedField === field ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-white text-center">Complete Your Bank Transfer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Please transfer the exact amount to the bank account below.
          Your order will be confirmed automatically once payment is received.
        </p>
        
        <div className="divide-y divide-primary/20">
            <DetailItem label="Bank Name" value={details.bank_name} field="Bank Name" />
            <DetailItem label="Account Name" value={details.account_name} field="Account Name" />
            <DetailItem label="Account Number" value={details.account_number} field="Account Number" />
            <DetailItem label="Amount (NGN)" value={(details.amount_expected / 100).toLocaleString('en-NG')} field="Amount" />
            <DetailItem label="Reference" value={details.reference} field="Reference" />
        </div>
        
        <div className="flex items-center justify-center pt-4">
          {isCheckingStatus && !orderStatus && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Waiting for payment confirmation...</span>
            </>
          )}
          {orderStatus === 'succeeded' && <span className="text-green-500">Payment Confirmed! Redirecting...</span>}
        </div>

        <p className="text-center text-xs text-muted-foreground pt-4">
            This page will automatically update. Do not close this window until your payment is confirmed.
        </p>
      </CardContent>
    </Card>
  );
};
