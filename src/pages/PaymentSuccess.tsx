import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      // The webhook will handle the final order confirmation. 
      // This page provides immediate feedback to the user that the payment process has been initiated.
      setStatus('success');
      const successMessage = 'Payment initiated! Your order is being processed. You will be notified via email once your payment is confirmed by the bank.';
      setMessage(successMessage);
      toast.success("Payment initiated successfully!");
      setTimeout(() => navigate('/'), 7000); // Redirect after 7 seconds
    } else {
      setStatus('error');
      const errorMessage = 'No order information found. If you have been charged, please contact support with your transaction details.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }, [orderId, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-white">{message}</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-white mb-6">{message}</p>
            <p className="text-sm text-muted-foreground mb-4">Redirecting you to the homepage shortly...</p>
            <Button asChild>
              <Link to="/">Go to Home Now</Link>
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-white mb-6">{message}</p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-white">Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
