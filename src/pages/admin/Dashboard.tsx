
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import AdminDiagnostics from '@/components/admin/AdminDiagnostics';

interface OrderAnalytics {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  failed_orders: number;
  refunded_orders: number;
  cancelled_orders: number;
}

const fetchOrderAnalytics = async (): Promise<OrderAnalytics> => {
  const { data, error } = await supabase.rpc('get_order_analytics');
  if (error) {
    console.error('Error fetching order analytics:', error);
    throw new Error(error.message);
  }
  return data as OrderAnalytics;
};

const fetchUserCount = async (): Promise<number> => {
  const { data, error } = await supabase.rpc('get_total_users_count');
  if (error) {
    console.error('Error fetching user count:', error);
    throw new Error(error.message);
  }
  return data;
};

const AdminDashboard: React.FC = () => {
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery<OrderAnalytics>({
    queryKey: ['orderAnalytics'],
    queryFn: fetchOrderAnalytics,
  });

  const { data: userCount, isLoading: userCountLoading, error: userCountError } = useQuery<number>({
    queryKey: ['userCount'],
    queryFn: fetchUserCount,
  });

  if (analyticsLoading || userCountLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDiagnostics />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card/30 border-primary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (analyticsError || userCountError) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDiagnostics />
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. You might not have the required permissions.
            Error details: {analyticsError?.message || userCountError?.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminDiagnostics />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.total_revenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_orders || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.pending_orders || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.total_orders ? 
                Math.round((analytics.completed_orders / analytics.total_orders) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.completed_orders || 0} of {analytics?.total_orders || 0} orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/30 border-primary/30">
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-medium">{analytics?.completed_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-medium">{analytics?.pending_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="font-medium">{analytics?.failed_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Refunded:</span>
                <span className="font-medium">{analytics?.refunded_orders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancelled:</span>
                <span className="font-medium">{analytics?.cancelled_orders || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-primary/30">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use the navigation above to:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Manage user accounts and roles</li>
                <li>• View and update order statuses</li>
                <li>• Monitor payment activities</li>
                <li>• Track affiliate performance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
