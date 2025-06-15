
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type AffiliateData = {
  affiliate: Database['public']['Tables']['affiliates']['Row'];
  stats: {
    totalEarnings: number;
    totalReferrals: number;
    totalClicks: number;
    commissionRate: number;
    pendingCommission: number;
  };
  referrals: any[];
  payouts: Database['public']['Tables']['affiliate_payouts']['Row'][];
  chartData: { name: string; earnings: number }[];
};

async function fetchAffiliateData(userId: string): Promise<AffiliateData> {
  // 1. Get affiliate details
  const { data: affiliate, error: affiliateError } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (affiliateError) throw new Error(affiliateError.message);
  if (!affiliate) throw new Error("Affiliate not found.");

  // 2. Get stats
  const { count: totalClicks, error: clicksError } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliate.id);

  const { data: referrals, error: referralsError } = await supabase
    .from('affiliate_referrals')
    .select('*, orders(profiles(first_name, last_name))')
    .eq('affiliate_id', affiliate.id)
    .order('created_at', { ascending: false });

  if (clicksError) throw new Error(clicksError.message);
  if (referralsError) throw new Error(referralsError.message);
    
  const totalEarnings = referrals
    ?.filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + Number(r.commission_amount || 0), 0) || 0;
  
  const pendingCommission = referrals
    ?.filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.commission_amount || 0), 0) || 0;
  
  const totalReferrals = referrals?.length || 0;

  // 3. Get payouts
  const { data: payouts, error: payoutsError } = await supabase
    .from('affiliate_payouts')
    .select('*')
    .eq('affiliate_id', affiliate.id)
    .order('requested_at', { ascending: false });
  
  if (payoutsError) throw new Error(payoutsError.message);

  // 4. Prepare chart data (earnings per month for last 12 months)
  const chartData: { name: string; earnings: number }[] = [];
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return { month: d.getMonth(), year: d.getFullYear() };
  }).reverse();

  months.forEach(({ month, year }) => {
    const monthName = new Date(year, month).toLocaleString('default', { month: 'short' });
    const monthlyEarnings = referrals
      ?.filter(r => r.status === 'completed')
      .filter(r => {
        const d = new Date(r.created_at);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, r) => sum + Number(r.commission_amount || 0), 0) || 0;
    chartData.push({ name: monthName, earnings: monthlyEarnings });
  });

  return {
    affiliate,
    stats: {
      totalEarnings,
      totalReferrals,
      totalClicks: totalClicks ?? 0,
      commissionRate: affiliate.commission_rate,
      pendingCommission
    },
    referrals: referrals || [],
    payouts: payouts || [],
    chartData
  };
}

export const useAffiliate = () => {
  const { user } = useAuth();

  return useQuery<AffiliateData, Error>({
    queryKey: ['affiliateData', user?.id],
    queryFn: () => fetchAffiliateData(user!.id),
    enabled: !!user,
  });
};
