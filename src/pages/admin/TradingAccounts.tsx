
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Activity, TrendingUp, Shield, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TradingAccountWithDetails {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  login_id: string;
  program_name: string;
  platform: string;
  starting_balance: number;
  status: string;
  is_visible: boolean;
  profit_protect: boolean;
  bi_weekly_payout: boolean;
  order_id: string | null;
  created_at: string;
}

const fetchTradingAccounts = async (): Promise<TradingAccountWithDetails[]> => {
  const { data, error } = await supabase.rpc('get_all_trading_accounts_with_details');
  if (error) {
    console.error('Error fetching trading accounts:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const TradingAccountsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const { data: accounts, isLoading, error } = useQuery<TradingAccountWithDetails[]>({
    queryKey: ['allTradingAccounts'],
    queryFn: fetchTradingAccounts,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ accountId, status }: { accountId: string; status: 'active' | 'passed' | 'failed' | 'inactive' }) => {
      const { error } = await supabase.rpc('update_trading_account_status', {
        target_account_id: accountId,
        new_status: status
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Trading account status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['allTradingAccounts'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const handleStatusUpdate = (accountId: string, status: string) => {
    if (['active', 'passed', 'failed', 'inactive'].includes(status)) {
      updateStatusMutation.mutate({ accountId, status: status as 'active' | 'passed' | 'failed' | 'inactive' });
    }
  };

  const filteredAccounts = accounts?.filter(account => {
    const statusMatch = statusFilter === 'all' || account.status === statusFilter;
    const platformMatch = platformFilter === 'all' || account.platform === platformFilter;
    return statusMatch && platformMatch;
  }) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, className: 'bg-green-500' },
      passed: { variant: 'default' as const, className: 'bg-blue-500' },
      failed: { variant: 'destructive' as const, className: '' },
      inactive: { variant: 'secondary' as const, className: '' }
    };
    const config = variants[status as keyof typeof variants] || { variant: 'outline' as const, className: '' };
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      MT4: 'bg-purple-500',
      MT5: 'bg-blue-500',
      HT5: 'bg-green-500'
    };
    return <Badge className={colors[platform as keyof typeof colors] || 'bg-gray-500'}>{platform}</Badge>;
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Trading Accounts</h1>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load trading accounts data. You might not have the required permissions.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate summary stats
  const totalAccounts = accounts?.length || 0;
  const activeAccounts = accounts?.filter(a => a.status === 'active').length || 0;
  const passedAccounts = accounts?.filter(a => a.status === 'passed').length || 0;
  const totalBalance = accounts?.reduce((sum, a) => sum + Number(a.starting_balance), 0) || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trading Accounts Management</h1>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passedAccounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="MT4">MT4</SelectItem>
            <SelectItem value="MT5">MT5</SelectItem>
            <SelectItem value="HT5">HT5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trading Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Login ID</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.user_name}</div>
                      <div className="text-sm text-muted-foreground">{account.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{account.login_id}</TableCell>
                  <TableCell>{account.program_name}</TableCell>
                  <TableCell>{getPlatformBadge(account.platform)}</TableCell>
                  <TableCell className="font-medium">${account.starting_balance.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {account.profit_protect && <Badge variant="outline" className="text-xs">PP</Badge>}
                      {account.bi_weekly_payout && <Badge variant="outline" className="text-xs">2W</Badge>}
                      {!account.is_visible && <Eye className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(account.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Select onValueChange={(value) => handleStatusUpdate(account.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingAccountsPage;
