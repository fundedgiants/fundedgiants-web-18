import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Bitcoin, Building2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AFFILIATE_CODE_STORAGE_KEY } from '@/hooks/useAffiliateTracking';

declare global {
  interface Window {
    PaystackPop?: any;
    Startbutton?: any;
  }
}

interface CheckoutState {
  program: string;
  accountSize: string;
  platform: string;
  priceFeed: string;
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    country: string;
    state: string;
    city: string;
    address: string;
    zipCode: string;
  };
  paymentMethod: string;
}

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [affiliateCodeInput, setAffiliateCodeInput] = useState(localStorage.getItem(AFFILIATE_CODE_STORAGE_KEY) || '');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string | null;
    discountAmount: number;
    affiliateToCredit: string | null;
    message: string;
  } | null>(null);
  
  const [checkoutData, setCheckoutData] = useState<CheckoutState>({
    program: searchParams.get('program') || 'heracles',
    accountSize: searchParams.get('size') || '2500',
    platform: 'MT5',
    priceFeed: 'real',
    billingInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+234',
      country: '',
      state: '',
      city: '',
      address: '',
      zipCode: ''
    },
    paymentMethod: 'card'
  });

  useEffect(() => {
    const program = checkoutData.program;
    if (program === 'heracles') {
        setCheckoutData(prev => ({ ...prev, priceFeed: 'real' }));
    } else {
        setCheckoutData(prev => ({ ...prev, priceFeed: 'simulated' }));
    }
  }, [checkoutData.program]);

  const programs = {
    heracles: { name: 'Rhino Rush (Instant Funding)', subtitle: 'Instant Funding' },
    zeus: { name: 'Phoenix Rise (2 Step Challenge)', subtitle: '2 Step Challenge' }
  };

  const accountSizes = [
    { value: '2500', label: '$2,500', price: checkoutData.program === 'heracles' ? 109 : 27 },
    { value: '5000', label: '$5,000', price: checkoutData.program === 'heracles' ? 209 : 47 },
    { value: '10000', label: '$10,000', price: checkoutData.program === 'heracles' ? 399 : 87 },
    { value: '25000', label: '$25,000', price: checkoutData.program === 'heracles' ? 999 : 187 },
    { value: '50000', label: '$50,000', price: checkoutData.program === 'heracles' ? 1989 : 367 },
    { value: '100000', label: '$100,000', price: checkoutData.program === 'heracles' ? 3989 : 567 }
  ];

  const steps = [
    { number: 1, title: 'Account Selection', completed: currentStep > 1 },
    { number: 2, title: 'Platform', completed: currentStep > 2 },
    { number: 3, title: 'Billing Information', completed: currentStep > 3 },
    { number: 4, title: 'Payment', completed: false }
  ];

  const selectedAccount = accountSizes.find(size => size.value === checkoutData.accountSize);
  const basePrice = selectedAccount?.price || 0;

  const discountAmount = appliedDiscount?.discountAmount || 0;
  const discountedBasePrice = basePrice > discountAmount ? basePrice - discountAmount : 0;

  const totalPrice = discountedBasePrice;

  const handleApplyCodes = async () => {
    if (!discountCode && !affiliateCodeInput) {
        toast.info("Please enter a discount or affiliate code.");
        return;
    }
    setIsApplyingCode(true);
    try {
        const { data, error } = await supabase.functions.invoke('validate-and-apply-codes', {
            body: { 
                discountCode: discountCode || undefined, 
                affiliateCode: affiliateCodeInput || undefined,
                basePrice,
                userId: null // Guest checkout - no user ID
            },
        });

        if (error) throw error;
        
        if (data.error) {
            toast.error(data.error);
            setAppliedDiscount(null);
        } else {
            toast.success(data.message);
            setAppliedDiscount({
                code: data.appliedCode,
                discountAmount: data.discountAmount,
                affiliateToCredit: data.affiliateToCredit,
                message: data.message,
            });
        }

    } catch (error: any) {
        toast.error(error.message || "Failed to apply code.");
        setAppliedDiscount(null);
    } finally {
        setIsApplyingCode(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handleBillingChange = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      billingInfo: { ...prev.billingInfo, [field]: value }
    }));
  };

  const handleCompletePurchase = async () => {
    setIsProcessing(true);

    const { email, firstName, lastName, phone, countryCode } = checkoutData.billingInfo;
    
    if (!email || !firstName || !lastName || !phone) {
      toast.error("Please fill in all required billing details.");
      setCurrentStep(4);
      setIsProcessing(false);
      return;
    }

    // Combine phone number parts
    const numberPart = phone.replace(/^0+/, '');
    const fullPhoneNumber = `${countryCode}${numberPart}`;

    const payment_provider = checkoutData.paymentMethod === 'crypto' ? 'nowpayments' 
                           : checkoutData.paymentMethod === 'card' ? 'coming_soon'
                           : checkoutData.paymentMethod === 'klasha' ? 'klasha'
                           : null;

    const trackedAffiliateCode = localStorage.getItem(AFFILIATE_CODE_STORAGE_KEY);
    const finalAffiliateToCredit = appliedDiscount?.affiliateToCredit || trackedAffiliateCode;

    // Create order without requiring authentication, but include customer data
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      user_id: null, // Guest order - no user ID required
      program_id: checkoutData.accountSize,
      program_name: programs[checkoutData.program as keyof typeof programs].name,
      platform: checkoutData.platform,
      program_price: basePrice,
      selected_addons: [],
      total_price: totalPrice,
      payment_method: checkoutData.paymentMethod,
      payment_provider: payment_provider,
      payment_status: 'pending',
      applied_discount_code: appliedDiscount?.code,
      discount_amount: discountAmount,
      affiliate_code: finalAffiliateToCredit,
      // Store customer data directly in the order
      customer_email: email,
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_phone: fullPhoneNumber,
      customer_country: checkoutData.billingInfo.country,
      customer_address: checkoutData.billingInfo.address,
      customer_city: checkoutData.billingInfo.city,
      customer_state: checkoutData.billingInfo.state,
      customer_zip_code: checkoutData.billingInfo.zipCode,
    }).select().single();

    if (orderError) {
      toast.error(`Order placement failed: ${orderError.message}`);
      setIsProcessing(false);
      return;
    }

    if (!orderData) {
      toast.error(`Order placement failed: Could not retrieve order data.`);
      setIsProcessing(false);
      return;
    }

    const orderId = orderData.id;

    // Send customer data to CRM immediately
    try {
      await supabase.functions.invoke('send-purchase-to-crm', {
        body: { orderId }
      });
      console.log('Customer data sent to CRM for order:', orderId);
    } catch (crmError) {
      console.error('Failed to send data to CRM:', crmError);
      // Don't block the purchase process for CRM errors
    }

    if (checkoutData.paymentMethod === 'klasha') {
      try {
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-klasha-payment', {
          body: { orderId, totalPrice },
        });

        if (paymentError) {
          throw new Error(paymentError.message);
        }

        if (paymentData.payment_url) {
          // Redirect to Klasha payment page
          window.location.href = paymentData.payment_url;
        } else {
          throw new Error('Could not retrieve payment URL from Klasha.');
        }
      } catch (error: any) {
        let errorMessage = 'Payment initialization failed. Please try again later.';
        if (error.message && (error.message.includes('error sending request') || error.message.includes('Failed to connect'))) {
          errorMessage = 'We are having trouble connecting to the payment provider. Please contact support if this issue persists.';
        } else if (error.message) {
          errorMessage = `Payment initialization failed: ${error.message}`;
        }
        
        toast.error(errorMessage);
        await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId);
        setIsProcessing(false);
      }
    } else if (checkoutData.paymentMethod === 'crypto') {
      try {
        const { data: invoiceData, error: invoiceError } = await supabase.functions.invoke('create-nowpayments-invoice', {
            body: { orderId, totalPrice },
        });

        if (invoiceError) {
            throw new Error(invoiceError.message);
        }

        if (invoiceData.invoice_url) {
            window.location.href = invoiceData.invoice_url;
        } else {
            throw new Error('Could not retrieve payment URL.');
        }
      } catch (error: any) {
          let errorMessage = 'Payment initialization failed. Please try again later.';
          if (error.message && (error.message.includes('error sending request') || error.message.includes('Failed to connect'))) {
              errorMessage = 'We are having trouble connecting to the payment provider. Please contact support if this issue persists.';
          } else if (error.message) {
              errorMessage = `Payment initialization failed: ${error.message}`;
          }
          
          toast.error(errorMessage);
          await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', orderId);
          setIsProcessing(false);
      }
    } else if (checkoutData.paymentMethod === 'card') {
      toast.warning("This payment method is coming soon!");
      await supabase.from('orders').update({ payment_status: 'cancelled' }).eq('id', orderId);
      setIsProcessing(false);
    } else {
      toast.error("Please select a payment method.");
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Select Trading Program</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(programs).map(([key, program]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      checkoutData.program === key
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/40'
                    }`}
                    onClick={() => setCheckoutData(prev => ({ ...prev, program: key }))}
                  >
                    <div className="text-center">
                      <div className="font-medium text-white">{program.name}</div>
                      <div className="text-sm text-primary">{program.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Select Account Size</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {accountSizes.map((size) => (
                  <div
                    key={size.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      checkoutData.accountSize === size.value
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/40'
                    }`}
                    onClick={() => setCheckoutData(prev => ({ ...prev, accountSize: size.value }))}
                  >
                    <div className="text-center">
                      <div className="font-bold text-white">{size.label}</div>
                      <div className="text-primary">${size.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        const platforms = [
          { value: 'MT5', label: 'MetaTrader 5' },
          { value: 'MatchTrader', label: 'MatchTrader' }
        ];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Trading Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all h-24 flex items-center justify-center ${
                      checkoutData.platform === platform.value
                        ? 'border-primary bg-primary/10'
                        : 'border-muted hover:border-primary/40'
                    }`}
                    onClick={() => setCheckoutData(prev => ({ ...prev, platform: platform.value }))}
                  >
                    <div className="text-center font-medium text-white text-lg">{platform.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Billing Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={checkoutData.billingInfo.firstName}
                  onChange={(e) => handleBillingChange('firstName', e.target.value)}
                  className="bg-card/50 border-muted"
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={checkoutData.billingInfo.lastName}
                  onChange={(e) => handleBillingChange('lastName', e.target.value)}
                  className="bg-card/50 border-muted"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-center">
                <Input
                  placeholder="Email"
                  type="email"
                  value={checkoutData.billingInfo.email}
                  onChange={(e) => handleBillingChange('email', e.target.value)}
                  className="bg-card/50 border-muted md:col-span-4"
                  required
                />
                <select
                  value={checkoutData.billingInfo.countryCode}
                  onChange={(e) => handleBillingChange('countryCode', e.target.value)}
                  className="bg-card/50 border border-muted rounded-md px-2 h-10 text-white md:col-span-2"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="+234">NG (+234)</option>
                  <option value="+1">US (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+27">ZA (+27)</option>
                  <option value="+233">GH (+233)</option>
                </select>
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={checkoutData.billingInfo.phone}
                  onChange={(e) => handleBillingChange('phone', e.target.value)}
                  className="bg-card/50 border-muted md:col-span-4"
                  required
                />
              </div>

              <Input
                placeholder="Address"
                value={checkoutData.billingInfo.address}
                onChange={(e) => handleBillingChange('address', e.target.value)}
                className="bg-card/50 border-muted"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={checkoutData.billingInfo.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    className="bg-card/50 border-muted"
                  />
                  <Input
                    placeholder="State"
                    value={checkoutData.billingInfo.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                    className="bg-card/50 border-muted"
                  />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="ZIP Code"
                  value={checkoutData.billingInfo.zipCode}
                  onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                  className="bg-card/50 border-muted"
                />
                <Input
                  placeholder="Country"
                  value={checkoutData.billingInfo.country}
                  onChange={(e) => handleBillingChange('country', e.target.value)}
                  className="bg-card/50 border-muted"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        const paymentMethods = [
            { value: 'klasha', label: 'Nigerian Bank Transfer', subtitle: 'via Klasha', icon: <Building2 className="h-8 w-8 text-primary mb-2" /> },
            { value: 'crypto', label: 'Cryptocurrency', subtitle: 'via NowPayments', icon: <Bitcoin className="h-8 w-8 text-primary mb-2" /> },
            { value: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="h-8 w-8 text-primary mb-2" /> },
        ];
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center text-center h-32 ${
                    checkoutData.paymentMethod === method.value
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/40'
                  }`}
                  onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: method.value }))}
                >
                  {method.icon}
                  <div className="font-medium text-white mt-1">{method.label}</div>
                   {method.subtitle && <div className="text-sm text-primary">{method.subtitle}</div>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  const purchaseButtonText = () => {
    return `Complete Purchase - $${totalPrice.toFixed(2)}`;
  }

  let buttonDisabledReason = '';

  if (isProcessing) {
    buttonDisabledReason = 'Processing your request...';
  }
  
  const isButtonDisabled = isProcessing;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="text-muted-foreground text-sm">
              No account required - Complete your purchase as a guest
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Content */}
            <div className="lg:col-span-2">
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Checkout</CardTitle>
                  
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mt-6">
                    {steps.map((step, index) => (
                      <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              step.completed
                                ? 'bg-primary text-white'
                                : currentStep === step.number
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {step.completed ? <Check className="h-5 w-5" /> : step.number}
                          </div>
                          <div className="text-xs text-center mt-2 text-muted-foreground w-20">
                            {step.title}
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              step.completed ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {renderStepContent()}
                  
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1 || isProcessing}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="inline-block">
                              <Button
                                onClick={handleCompletePurchase}
                                className="bg-primary hover:bg-primary/90"
                                disabled={isButtonDisabled}
                              >
                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {purchaseButtonText()}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {buttonDisabledReason && (
                            <TooltipContent>
                              <p>{buttonDisabledReason}</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 backdrop-blur-sm border-primary/20 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Program:</span>
                    <span className="text-white font-medium">
                      {programs[checkoutData.program as keyof typeof programs]?.name}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Account Size:</span>
                    <span className="text-white font-medium">{selectedAccount?.label}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="text-white font-medium">{checkoutData.platform}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price Feed:</span>
                    <span className="text-white font-medium capitalize">{checkoutData.priceFeed}</span>
                  </div>
                  
                  <Separator className="bg-primary/20" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className={`text-white font-medium ${discountAmount > 0 ? 'line-through text-muted-foreground' : ''}`}>${basePrice.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="text-green-400 font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2 pt-2 pb-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Discount Code"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                            className="bg-card/50 border-muted"
                            disabled={isApplyingCode}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Affiliate Code"
                            value={affiliateCodeInput}
                            onChange={(e) => setAffiliateCodeInput(e.target.value)}
                            className="bg-card/50 border-muted"
                            disabled={isApplyingCode}
                        />
                        <Button size="sm" onClick={handleApplyCodes} disabled={isApplyingCode}>
                            {isApplyingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                        </Button>
                    </div>
                    {appliedDiscount?.message && <p className="text-xs text-green-400 text-center px-2">{appliedDiscount.message}</p>}
                  </div>

                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
