
import { useAuth } from '@/hooks/useAuth';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Loader2, DollarSign, Users, MousePointerClick, Percent, AlertCircle, Award } from 'lucide-react';
import StatCard from '@/components/affiliate/StatCard';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import EarningsChart from '@/components/affiliate/EarningsChart';
import ReferralsTable from '@/components/affiliate/ReferralsTable';
import PayoutsTable from '@/components/affiliate/PayoutsTable';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AffiliateLogin from '@/components/affiliate/AffiliateLogin';

const AffiliatePortal = () => {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading: affiliateLoading, error } = useAffiliate();

  const isLoading = authLoading || affiliateLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in, show Login and Register options
  if (!user) {
    return (
        <div className="container mx-auto max-w-4xl py-8 grid gap-8 md:grid-cols-2 items-start">
            <AffiliateLogin />
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl">Not an Affiliate Yet?</CardTitle>
                    <CardDescription>
                        Join our program to earn commissions by promoting our products. Click the button below to start your application.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link to="/become-affiliate">Become an Affiliate</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load affiliate data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // If user is logged in, but not yet an affiliate (no affiliate data found)
  if (!data) {
    return (
       <div className="container mx-auto max-w-2xl py-8 text-center">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl">Join our Affiliate Program</CardTitle>
                    <CardDescription>
                        You're logged in, but you haven't joined our affiliate program yet. Ready to earn by promoting us?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link to="/become-affiliate">Become an Affiliate</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  const { affiliate, stats, referrals, payouts, chartData } = data;

  if (affiliate.status === 'pending') {
    return (
      <div className="container mx-auto max-w-2xl py-8 text-center">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Application Pending</CardTitle>
            <CardDescription>
              Thank you for applying! Your affiliate application is currently under review. We'll notify you once a decision has been made.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (affiliate.status === 'rejected') {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Application Status</AlertTitle>
          <AlertDescription>
            We regret to inform you that your affiliate application was not approved at this time.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (affiliate.status !== 'approved') {
    console.warn("Unhandled affiliate status:", affiliate.status);
    return (
       <div className="container mx-auto max-w-2xl py-8">
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Application Status: {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}</AlertTitle>
          <AlertDescription>
            Your affiliate account status is currently being processed. If you believe this is an error, please contact support.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Affiliate Portal</h1>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Pending Commission" value={`$${stats.pendingCommission.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Total Referrals" value={stats.totalReferrals.toString()} icon={Users} />
        <StatCard title="Total Clicks" value={stats.totalClicks.toString()} icon={MousePointerClick} />
        <StatCard title="Commission Rate" value={`${stats.commissionRate * 100}%`} icon={Percent} />
        <StatCard title="Current Tier" value={affiliate.tier.charAt(0).toUpperCase() + affiliate.tier.slice(1)} icon={Award} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <AffiliateLink affiliateCode={affiliate.affiliate_code} />
            <EarningsChart data={chartData} />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <ReferralsTable referrals={referrals.slice(0, 5)} />
        </div>
      </div>
      
      <div>
        <PayoutsTable payouts={payouts} />
      </div>
    </div>
  );
};

export default AffiliatePortal;
