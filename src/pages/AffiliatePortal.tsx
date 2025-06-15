
import { useAffiliate } from '@/hooks/useAffiliate';
import { Loader2, DollarSign, Users, MousePointerClick, Percent, AlertCircle } from 'lucide-react';
import StatCard from '@/components/affiliate/StatCard';
import AffiliateLink from '@/components/affiliate/AffiliateLink';
import EarningsChart from '@/components/affiliate/EarningsChart';
import ReferralsTable from '@/components/affiliate/ReferralsTable';
import PayoutsTable from '@/components/affiliate/PayoutsTable';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AffiliatePortal = () => {
  const { data, isLoading, error } = useAffiliate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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

  if (!data) {
    return (
       <div className="text-center text-muted-foreground">No affiliate data found.</div>
    )
  }

  const { affiliate, stats, referrals, payouts, chartData } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Affiliate Portal</h1>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon={DollarSign} className="lg:col-span-1" />
        <StatCard title="Pending Commission" value={`$${stats.pendingCommission.toFixed(2)}`} icon={DollarSign} className="lg:col-span-1" />
        <StatCard title="Total Referrals" value={stats.totalReferrals.toString()} icon={Users} className="lg:col-span-1" />
        <StatCard title="Total Clicks" value={stats.totalClicks.toString()} icon={MousePointerClick} className="lg:col-span-1" />
        <StatCard title="Commission Rate" value={`${stats.commissionRate * 100}%`} icon={Percent} className="lg:col-span-1" />
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
