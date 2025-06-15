
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ChallengeDetails } from '@/components/dashboard/ChallengeDetails';
import { GainsTarget } from '@/components/dashboard/GainsTarget';
import { LossLimits } from '@/components/dashboard/LossLimits';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { TradingStats } from '@/components/dashboard/TradingStats';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['trading_accounts', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching trading accounts:', error);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });
  
  const loading = authLoading || accountsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const activeAccount = accounts?.[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        {activeAccount && <Button onClick={() => navigate('/checkout')}>Get Another Account</Button>}
      </div>

      {activeAccount ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BalanceCard account={activeAccount} user={user} />
              <ChallengeDetails account={activeAccount} />
            </div>
            <PerformanceChart />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            <GainsTarget />
            <LossLimits />
            <TradingStats />
          </div>
        </div>
      ) : (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-white">Start Your Trading Journey</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">You don't have any trading accounts yet. Get funded to start.</p>
            <Button size="lg" onClick={() => navigate('/checkout')}>Get Funded Now</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
