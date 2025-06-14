
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";

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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const activeAccount = accounts?.[0];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.user_metadata.first_name || user?.email}</h1>
        <Button onClick={() => navigate('/checkout')}>Get Funded</Button>
      </div>

      {activeAccount ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Account Overview</CardTitle>
              <CardDescription>{activeAccount.program_name} - ${Number(activeAccount.starting_balance).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Account Size</p>
                  <p className="text-lg font-bold">${Number(activeAccount.starting_balance).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p className="text-lg font-bold">{activeAccount.platform}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit Target</p>
                  <p className="text-lg font-bold text-primary">$10,000</p>
                </div>
                 <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit/Loss</p>
                  <p className="text-lg font-bold text-green-500">$2,500</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Profit Target</h3>
                <Progress value={25} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$2,500</span>
                  <span>$10,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                <Button variant="outline" onClick={() => navigate('/trading-accounts')}>View All Accounts</Button>
                <Button variant="outline" onClick={() => navigate('/billing')}>Billing History</Button>
                <Button variant="outline" onClick={() => navigate('/profile')}>Profile Settings</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-white">No Trading Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You don't have any trading accounts yet.</p>
            <Button className="mt-4" onClick={() => navigate('/checkout')}>Get Funded</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
