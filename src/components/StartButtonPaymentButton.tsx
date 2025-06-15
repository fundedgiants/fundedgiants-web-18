
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Startbutton?: any;
  }
}

interface StartButtonPaymentButtonProps {
  config: {
    publicKey: string;
    amount: number; // in lowest denomination
    email: string;
    reference: string;
    onSuccess: (response: any) => void;
    onClose: () => void;
  };
  isProcessing: boolean;
}

const StartButtonPaymentButton: React.FC<StartButtonPaymentButtonProps> = ({ config, isProcessing }) => {
  
  const handlePayment = () => {
    if (!window.Startbutton) {
      toast.error("Payment script not loaded. Please refresh the page.");
      return;
    }

    window.Startbutton.show({
      key: config.publicKey,
      amount: config.amount,
      email: config.email,
      reference: config.reference,
      payment_methods: ['bank_transfer'],
      onSuccess: config.onSuccess,
      onClose: config.onClose,
    });
  };

  useEffect(() => {
    // Automatically trigger payment when component mounts
    handlePayment();
  }, [config]); // Re-trigger if config changes

  return (
    <Button
      onClick={handlePayment}
      className="bg-primary hover:bg-primary/90"
      disabled={isProcessing}
    >
      {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Finalize Payment
    </Button>
  );
};

export default StartButtonPaymentButton;
