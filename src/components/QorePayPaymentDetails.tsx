
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface QorePayDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
  amount: string;
  currency: string;
  expires_at: string;
}

interface QorePayPaymentDetailsProps {
  details: QorePayDetails;
}

const QorePayPaymentDetails: React.FC<QorePayPaymentDetailsProps> = ({ details }) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 mt-6">
      <CardHeader>
        <CardTitle className="text-white">Complete Your Payment</CardTitle>
        <CardDescription>
          Please transfer the exact amount to the account details below. The account is temporary and will expire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-white">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-bold text-lg text-primary">{details.currency} {parseFloat(details.amount).toLocaleString()}</span>
        </div>
        <div className="space-y-2 p-4 border border-muted rounded-lg">
          <p className="flex justify-between">
            <span className="text-muted-foreground">Bank:</span>
            <span>{details.bank_name}</span>
          </p>
          <p className="flex justify-between items-center">
            <span className="text-muted-foreground">Account Number:</span>
            <span className="flex items-center gap-2">
              {details.account_number}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(details.account_number)}>
                <Copy className="h-4 w-4" />
              </Button>
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Account Name:</span>
            <span>{details.account_name}</span>
          </p>
        </div>
        <p className="text-xs text-center text-amber-400">
          This account will expire at: {new Date(details.expires_at).toLocaleString()}
        </p>
        <p className='text-sm text-center text-muted-foreground'>Once your payment is confirmed, your order will be processed automatically. You will receive a confirmation email.</p>
      </CardContent>
    </Card>
  );
};

export default QorePayPaymentDetails;
