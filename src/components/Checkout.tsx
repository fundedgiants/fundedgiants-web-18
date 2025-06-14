
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Check, CreditCard, Smartphone } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface CheckoutState {
  program: string;
  accountSize: string;
  platform: string;
  priceFeed: string;
  addOns: string[];
  billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
  
  const [checkoutData, setCheckoutData] = useState<CheckoutState>({
    program: searchParams.get('program') || 'heracles',
    accountSize: searchParams.get('size') || '2500',
    platform: 'MT5',
    priceFeed: 'real',
    addOns: [],
    billingInfo: {
      firstName: '', lastName: '', email: '', phone: '',
      country: '', state: '', city: '', address: '', zipCode: ''
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
    heracles: { name: 'Heracles Trader', subtitle: 'Instant Funding' },
    orion: { name: 'Orion Program', subtitle: '1 Step Challenge' },
    zeus: { name: 'Zeus Program', subtitle: '2 Step Challenge' }
  };

  const accountSizes = [
    { value: '2500', label: '$2,500', price: checkoutData.program === 'heracles' ? 129 : checkoutData.program === 'orion' ? 59 : 27 },
    { value: '5000', label: '$5,000', price: checkoutData.program === 'heracles' ? 239 : checkoutData.program === 'orion' ? 89 : 47 },
    { value: '10000', label: '$10,000', price: checkoutData.program === 'heracles' ? 449 : checkoutData.program === 'orion' ? 149 : 87 },
    { value: '25000', label: '$25,000', price: checkoutData.program === 'heracles' ? 1149 : checkoutData.program === 'orion' ? 249 : 187 },
    { value: '50000', label: '$50,000', price: checkoutData.program === 'heracles' ? 2299 : checkoutData.program === 'orion' ? 449 : 367 },
    { value: '100000', label: '$100,000', price: checkoutData.program === 'heracles' ? 4599 : checkoutData.program === 'orion' ? 749 : 567 }
  ];

  const addOns = [
    { id: 'leverage', name: 'Increase Leverage to 1:50', description: 'Boost your trading power with higher leverage.', pricePercent: 20 },
    { id: 'drawdown', name: 'Increase DrawDown by 2%', description: 'Get more room for your trades to breathe.', pricePercent: 20 },
    { id: 'no_profit_target', name: 'Remove Profit Target (First 3 Withdrawals)', description: 'Removes profit targets and minimum trading days for your first 3 payouts.', pricePercent: 30 },
    { id: 'profit_split', name: 'Increase Profit Split to 80%', description: 'Enjoy an 80% profit split from the very beginning.', pricePercent: 50 }
  ];

  const steps = [
    { number: 1, title: 'Account Selection', completed: currentStep > 1 },
    { number: 2, title: 'Platform', completed: currentStep > 2 },
    { number: 3, title: 'Add-ons', completed: currentStep > 3 },
    { number: 4, title: 'Billing Information', completed: currentStep > 4 },
    { number: 5, title: 'Payment', completed: false }
  ];

  const selectedAccount = accountSizes.find(size => size.value === checkoutData.accountSize);
  const basePrice = selectedAccount?.price || 0;
  const selectedAddOns = addOns.filter(addon => checkoutData.addOns.includes(addon.id));
  const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + (basePrice * (addon.pricePercent / 100)), 0);
  const totalPrice = basePrice + addOnsPrice;

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleAddOnToggle = (addonId: string) => {
    setCheckoutData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addonId)
        ? prev.addOns.filter(id => id !== addonId)
        : [...prev.addOns, addonId]
    }));
  };

  const handleBillingChange = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      billingInfo: { ...prev.billingInfo, [field]: value }
    }));
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
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Trading Platform</h3>
              <RadioGroup 
                value={checkoutData.platform} 
                onValueChange={(value) => setCheckoutData(prev => ({ ...prev, platform: value }))}
              >
                <div className="flex items-center space-x-3 p-4 border border-primary/20 rounded-lg">
                  <RadioGroupItem value="MT5" id="mt5" />
                  <label htmlFor="mt5" className="cursor-pointer text-white">MetaTrader 5</label>
                </div>
                <div className="flex items-center space-x-3 p-4 border border-primary/20 rounded-lg">
                  <RadioGroupItem value="MatchTrader" id="matchtrader" />
                  <label htmlFor="matchtrader" className="cursor-pointer text-white">MatchTrader</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Select Add-ons (Optional)</h3>
            {addOns.map((addon) => (
              <div
                key={addon.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  checkoutData.addOns.includes(addon.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/40'
                }`}
                onClick={() => handleAddOnToggle(addon.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{addon.name}</div>
                    <div className="text-sm text-muted-foreground">{addon.description}</div>
                  </div>
                  <div className="text-primary font-bold">+{addon.pricePercent}%</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Billing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={checkoutData.billingInfo.firstName}
                onChange={(e) => handleBillingChange('firstName', e.target.value)}
                className="bg-card/50 border-muted"
              />
              <Input
                placeholder="Last Name"
                value={checkoutData.billingInfo.lastName}
                onChange={(e) => handleBillingChange('lastName', e.target.value)}
                className="bg-card/50 border-muted"
              />
              <Input
                placeholder="Email"
                type="email"
                value={checkoutData.billingInfo.email}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                className="bg-card/50 border-muted md:col-span-2"
              />
              <Input
                placeholder="Phone"
                value={checkoutData.billingInfo.phone}
                onChange={(e) => handleBillingChange('phone', e.target.value)}
                className="bg-card/50 border-muted"
              />
              <Input
                placeholder="Country"
                value={checkoutData.billingInfo.country}
                onChange={(e) => handleBillingChange('country', e.target.value)}
                className="bg-card/50 border-muted"
              />
              <Input
                placeholder="State"
                value={checkoutData.billingInfo.state}
                onChange={(e) => handleBillingChange('state', e.target.value)}
                className="bg-card/50 border-muted"
              />
              <Input
                placeholder="City"
                value={checkoutData.billingInfo.city}
                onChange={(e) => handleBillingChange('city', e.target.value)}
                className="bg-card/50 border-muted"
              />
              <Input
                placeholder="Address"
                value={checkoutData.billingInfo.address}
                onChange={(e) => handleBillingChange('address', e.target.value)}
                className="bg-card/50 border-muted md:col-span-2"
              />
              <Input
                placeholder="ZIP Code"
                value={checkoutData.billingInfo.zipCode}
                onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                className="bg-card/50 border-muted"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Payment Method</h3>
            <RadioGroup 
              value={checkoutData.paymentMethod} 
              onValueChange={(value) => setCheckoutData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <div className="flex items-center space-x-3 p-4 border border-primary/20 rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-primary" />
                <label htmlFor="card" className="cursor-pointer text-white">Credit/Debit Card</label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-primary/20 rounded-lg">
                <RadioGroupItem value="crypto" id="crypto" />
                <Smartphone className="h-5 w-5 text-primary" />
                <label htmlFor="crypto" className="cursor-pointer text-white">Cryptocurrency</label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-primary/20 rounded-lg">
                <RadioGroupItem value="ngn" id="ngn" />
                <span className="text-primary font-bold">₦</span>
                <label htmlFor="ngn" className="cursor-pointer text-white">Nigerian Naira (NGN)</label>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
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
                          <div className="text-xs text-center mt-2 text-muted-foreground">
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
                      disabled={currentStep === 1}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep < 5 ? (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button className="bg-primary hover:bg-primary/90">
                        Complete Purchase - ${totalPrice.toFixed(2)}
                      </Button>
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
                    <span className="text-white">${selectedAccount?.price}</span>
                  </div>
                  
                  {selectedAddOns.map((addon) => (
                    <div key={addon.id} className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">{addon.name} ({addon.pricePercent}%):</span>
                      <span className="text-white">+${(basePrice * (addon.pricePercent / 100)).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <Separator className="bg-primary/20" />
                  
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
