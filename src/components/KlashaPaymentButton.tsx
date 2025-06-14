
import React from 'react';
import { useKlasha } from 'klasha-pay';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface KlashaPaymentButtonProps {
  config: any;
  isProcessing: boolean;
}

const KlashaPaymentButton: React.FC<KlashaPaymentButtonProps> = ({ config, isProcessing }) => {
  // The useKlasha hook from 'klasha-pay' expects `merchant_key`.
  // Our config from the backend provides `publicKey`. We'll map it here.
  const klashaOptions = {
    ...config,
    merchant_key: config.publicKey,
    // Add is_production flag. This should ideally be controlled via environment variables.
    // For now, we'll set it to false for development.
    is_production: false,
  };
  // Clean up the old key to avoid confusion
  delete klashaOptions.publicKey;

  const initializePayment = useKlasha(klashaOptions);

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
