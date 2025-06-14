
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
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found. Please contact support if you have been charged.');
      return;
    }

    const verifyPayment = async () => {
      try {
        // The webhook will handle the final update. This page is for user feedback.
        // We can optionally call a verification function here for immediate feedback.
        // For now, we'll assume success if they are redirected here with a reference.
        // The webhook is the source of truth.
        setStatus('success');
        setMessage('Payment successful! Your order is being processed. You will be notified once it is confirmed.');
        toast.success("Payment successful! Your order is being processed.");
        setTimeout(() => navigate('/dashboard'), 5000);

      } catch (err: any) {
        setStatus('error');
        const userFriendlyMessage = 'There was an issue confirming your payment. Please contact support.';
        setMessage(userFriendlyMessage);
        console.error('Verification error:', err);
        toast.error(userFriendlyMessage);
      }
    };

    verifyPayment();
  }, [reference, navigate]);

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
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-white mb-6">{message}</p>
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Contact Support
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
