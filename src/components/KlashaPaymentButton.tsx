
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Klasha's SDK attaches itself to the window object.
// We declare it here to make TypeScript aware of it.
declare global {
  interface Window {
    KlashaClient?: any;
  }
}

interface KlashaPaymentButtonProps {
  config: any;
  isProcessing: boolean;
}

const KlashaPaymentButton: React.FC<KlashaPaymentButtonProps> = ({ config, isProcessing }) => {
  const handleKlashaPayment = () => {
    if (!window.KlashaClient) {
      toast.error("Payment provider script not loaded. Please refresh the page and try again.");
      return;
    }

    // The configuration object maps directly to the KlashaClient constructor.
    // We use the publicKey from our backend as the merchantKey.
    const klasha = new window.KlashaClient({
      merchantKey: config.publicKey,
      amount: config.amount,
      tx_ref: config.tx_ref,
      currency: config.currency,
      email: config.email,
      firstname: config.firstname,
      lastname: config.lastname,
      phone_number: config.phone_number,
      callback: config.callback,
      onClose: config.onClose,
      is_production: false, // For development
    });

    klasha.init();
  };

  return (
    <Button
      onClick={handleKlashaPayment}
      className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded inline-flex items-center justify-center"
      disabled={isProcessing}
    >
      {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Pay with Klasha - ₦{config.amount.toLocaleString('en-NG')}
    </Button>
  );
};

export default KlashaPaymentButton;
