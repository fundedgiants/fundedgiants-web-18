
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Edit, DollarSign, Users, MousePointer } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AffiliateWithStats {
  id: string;
  user_id: string;
  user_email: string;
  affiliate_code: string;
  status: string;
  tier: string;
  commission_rate: number;
  total_clicks: number;
  total_referrals: number;
  total_earnings: number;
  pending_earnings: number;
  created_at: string;
  personal_info: any;
  social_media_urls: any;
  promotion_methods: string;
}

const fetchAffiliates = async (): Promise<AffiliateWithStats[]> => {
  // First get all affiliates
  const { data: affiliatesData, error: affiliatesError } = await supabase
    .from('affiliates')
    .select(`
      id,
      user_id,
      affiliate_code,
      status,
      tier,
      commission_rate,
      created_at,
      personal_info,
      social_media_urls,
      promotion_methods
    `);

  if (affiliatesError) {
    console.error('Error fetching affiliates:', affiliatesError);
    throw new Error(affiliatesError.message);
  }

  // Get user emails
  const userIds = affiliatesData?.map(a => a.user_id) || [];
  const { data: usersData } = await supabase.auth.admin.listUsers();
  
  // Create a map for quick email lookup
  const userEmailMap = new Map();
  usersData.users?.forEach(user => {
    userEmailMap.set(user.id, user.email);
  });

  // Get affiliate clicks stats
  const { data: clicksData } = await supabase
    .from('affiliate_clicks')
    .select('affiliate_id')
    .in('affiliate_id', affiliatesData?.map(a => a.id) || []);

  // Get referrals stats
  const { data: referralsData } = await supabase
    .from('affiliate_referrals')
    .select('affiliate_id, commission_amount, status')
    .in('affiliate_id', affiliatesData?.map(a => a.id) || []);

  // Process the data
  return affiliatesData?.map(affiliate => {
    const clicks = clicksData?.filter(c => c.affiliate_id === affiliate.id).length || 0;
    const referrals = referralsData?.filter(r => r.affiliate_id === affiliate.id) || [];
    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(r => r.status === 'completed');
    const pendingReferrals = referrals.filter(r => r.status === 'pending');
    const totalEarnings = completedReferrals.reduce((sum, r) => sum + Number(r.commission_amount), 0);
    const pendingEarnings = pendingReferrals.reduce((sum, r) => sum + Number(r.commission_amount), 0);

    return {
      ...affiliate,
      user_email: userEmailMap.get(affiliate.user_id) || 'Unknown',
      total_clicks: clicks,
      total_referrals: totalReferrals,
      total_earnings: totalEarnings,
      pending_earnings: pendingEarnings
    };
  }) || [];
};

const AffiliatesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateWithStats | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: affiliates, isLoading, error } = useQuery<AffiliateWithStats[]>({
    queryKey: ['allAffiliates'],
    queryFn: fetchAffiliates,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ affiliateId, status }: { affiliateId: string; status: string }) => {
      const { error } = await supabase
        .from('affiliates')
        .update({ status })
        .eq('id', affiliateId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Affiliate status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['allAffiliates'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const updateCommissionMutation = useMutation({
    mutationFn: async ({ affiliateId, rate }: { affiliateId: string; rate: number }) => {
      const { error } = await supabase
        .from('affiliates')
        .update({ commission_rate: rate })
        .eq('id', affiliateId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Commission rate updated successfully');
      queryClient.invalidateQueries({ queryKey: ['allAffiliates'] });
      setSelectedAffiliate(null);
      setNewCommissionRate('');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update commission rate: ${error.message}`);
    },
  });

  const handleStatusUpdate = (affiliateId: string, status: string) => {
    updateStatusMutation.mutate({ affiliateId, status });
  };

  const handleCommissionUpdate = () => {
    if (!selectedAffiliate || !newCommissionRate) return;
    const rate = parseFloat(newCommissionRate) / 100; // Convert percentage to decimal
    updateCommissionMutation.mutate({ affiliateId: selectedAffiliate.id, rate });
  };

  const filteredAffiliates = affiliates?.filter(affiliate => 
    statusFilter === 'all' || affiliate.status === statusFilter
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      bronze: 'bg-orange-500',
      silver: 'bg-gray-500',
      gold: 'bg-yellow-500'
    };
    return <Badge className={colors[tier as keyof typeof colors] || 'bg-gray-500'}>{tier}</Badge>;
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Affiliate Management</h1>
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
          Failed to load affiliate data. You might not have the required permissions.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate summary stats
  const totalAffiliates = affiliates?.length || 0;
  const approvedAffiliates = affiliates?.filter(a => a.status === 'approved').length || 0;
  const pendingAffiliates = affiliates?.filter(a => a.status === 'pending').length || 0;
  const totalEarnings = affiliates?.reduce((sum, a) => sum + Number(a.total_earnings), 0) || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Affiliate Management</h1>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAffiliates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedAffiliates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <MousePointer className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAffiliates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Affiliates Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affiliate</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{affiliate.user_email}</div>
                      {affiliate.personal_info?.name && (
                        <div className="text-sm text-muted-foreground">{affiliate.personal_info.name}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{affiliate.affiliate_code}</TableCell>
                  <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                  <TableCell>{getTierBadge(affiliate.tier)}</TableCell>
                  <TableCell>{(affiliate.commission_rate * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{affiliate.total_clicks} clicks</div>
                      <div>{affiliate.total_referrals} referrals</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">${affiliate.total_earnings.toFixed(2)}</div>
                      {affiliate.pending_earnings > 0 && (
                        <div className="text-muted-foreground">${affiliate.pending_earnings.toFixed(2)} pending</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(affiliate.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {affiliate.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(affiliate.id, 'approved')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(affiliate.id, 'rejected')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAffiliate(affiliate);
                              setNewCommissionRate((affiliate.commission_rate * 100).toString());
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Affiliate</DialogTitle>
                            <DialogDescription>
                              Update commission rate for {affiliate.user_email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="commission">Commission Rate (%)</Label>
                              <Input
                                id="commission"
                                type="number"
                                min="0"
                                max="50"
                                step="0.1"
                                value={newCommissionRate}
                                onChange={(e) => setNewCommissionRate(e.target.value)}
                                placeholder="Enter commission rate"
                              />
                            </div>
                            <Button
                              onClick={handleCommissionUpdate}
                              disabled={updateCommissionMutation.isPending}
                              className="w-full"
                            >
                              Update Commission Rate
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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

export default AffiliatesPage;
