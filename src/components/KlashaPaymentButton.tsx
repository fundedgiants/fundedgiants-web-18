
import React from 'react';
import { useKlasha } from 'klasha-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface KlashaPaymentButtonProps {
  config: any;
  isProcessing: boolean;
}

const KlashaPaymentButton: React.FC<KlashaPaymentButtonProps> = ({ config, isProcessing }) => {
  const initializePayment = useKlasha(config);

  return (
    <Button 
      onClick={() => initializePayment()} 
      className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded inline-flex items-center justify-center" 
      disabled={isProcessing}
    >
      {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Pay with Klasha - ₦{config.amount.toLocaleString('en-NG')}
    </Button>
  );
};

export default KlashaPaymentButton;
