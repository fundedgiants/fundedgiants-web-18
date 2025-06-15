
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, ShoppingCart, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const fetchTotalUsers = async () => {
  const { data, error } = await supabase.rpc('get_total_users_count');

  if (error) {
    console.error('Error fetching total users:', error);
    throw new Error(error.message);
  }
  return data;
};

const fetchOrderAnalytics = async () => {
  const { data, error } = await supabase.rpc('get_order_analytics');
  if (error) {
    console.error('Error fetching order analytics:', error);
    throw new Error(error.message);
  }
  return data;
};

const Dashboard: React.FC = () => {
    const { data: totalUsers, isLoading: isLoadingUsers, error: usersError } = useQuery({
        queryKey: ['totalUsers'],
        queryFn: fetchTotalUsers,
    });
    
    const { data: orderAnalytics, isLoading: isLoadingAnalytics, error: analyticsError } = useQuery({
        queryKey: ['orderAnalytics'],
        queryFn: fetchOrderAnalytics,
    });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-24" />
            ) : analyticsError ? (
                <div className="text-sm font-bold text-destructive">Error</div>
            ) : (
                <div className="text-2xl font-bold">${(orderAnalytics?.total_revenue || 0).toFixed(2)}</div>
            )}
            <p className="text-xs text-muted-foreground">From completed orders</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-8 w-20" />
            ) : usersError ? (
                <div className="text-sm font-bold text-destructive">Error</div>
            ) : (
                <div className="text-2xl font-bold">{totalUsers}</div>
            )}
            <p className="text-xs text-muted-foreground">Total registered users in the system</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : analyticsError ? (
                <div className="text-sm font-bold text-destructive">Error</div>
            ) : (
                <div className="text-2xl font-bold">+{orderAnalytics?.total_orders || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">{orderAnalytics?.completed_orders || 0} completed</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : analyticsError ? (
                <div className="text-sm font-bold text-destructive">Error</div>
            ) : (
                <div className="text-2xl font-bold">+{orderAnalytics?.pending_orders || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Awaiting payment confirmation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
