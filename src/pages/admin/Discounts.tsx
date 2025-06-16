
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
import { AlertTriangle, Percent, Users, DollarSign, Calendar, Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface DiscountCodeWithStats {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  usage_limit: number | null;
  times_used: number;
  user_segment: string;
  expires_at: string | null;
  created_at: string;
  total_revenue_impact: number;
}

const fetchDiscountCodes = async (): Promise<DiscountCodeWithStats[]> => {
  const { data, error } = await supabase.rpc('get_all_discount_codes_with_stats');
  if (error) {
    console.error('Error fetching discount codes:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const DiscountsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCodeWithStats | null>(null);

  // Create discount form state
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [userSegment, setUserSegment] = useState('all');
  const [expiresAt, setExpiresAt] = useState('');

  // Edit form state
  const [editUsageLimit, setEditUsageLimit] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');

  const { data: discountCodes, isLoading, error } = useQuery<DiscountCodeWithStats[]>({
    queryKey: ['allDiscountCodes'],
    queryFn: fetchDiscountCodes,
  });

  const createDiscountMutation = useMutation({
    mutationFn: async (data: {
      code: string;
      discount_type: string;
      discount_value: number;
      usage_limit?: number;
      user_segment: string;
      expires_at?: string;
    }) => {
      const { error } = await supabase.rpc('create_discount_code', {
        p_code: data.code,
        p_discount_type: data.discount_type,
        p_discount_value: data.discount_value,
        p_usage_limit: data.usage_limit || null,
        p_user_segment: data.user_segment,
        p_expires_at: data.expires_at || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Discount code created successfully');
      queryClient.invalidateQueries({ queryKey: ['allDiscountCodes'] });
      setIsCreateDialogOpen(false);
      resetCreateForm();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create discount code: ${error.message}`);
    },
  });

  const updateDiscountMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      is_active?: boolean;
      usage_limit?: number;
      expires_at?: string;
    }) => {
      const { error } = await supabase.rpc('update_discount_code', {
        p_id: data.id,
        p_is_active: data.is_active,
        p_usage_limit: data.usage_limit,
        p_expires_at: data.expires_at,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Discount code updated successfully');
      queryClient.invalidateQueries({ queryKey: ['allDiscountCodes'] });
      setIsEditDialogOpen(false);
      setSelectedCode(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update discount code: ${error.message}`);
    },
  });

  const resetCreateForm = () => {
    setNewCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setUsageLimit('');
    setUserSegment('all');
    setExpiresAt('');
  };

  const handleCreateDiscount = () => {
    if (!newCode || !discountValue) {
      toast.error('Please fill in all required fields');
      return;
    }

    createDiscountMutation.mutate({
      code: newCode.toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      usage_limit: usageLimit ? parseInt(usageLimit) : undefined,
      user_segment: userSegment,
      expires_at: expiresAt || undefined,
    });
  };

  const handleToggleActive = (code: DiscountCodeWithStats) => {
    updateDiscountMutation.mutate({
      id: code.id,
      is_active: !code.is_active,
    });
  };

  const handleEditDiscount = () => {
    if (!selectedCode) return;

    updateDiscountMutation.mutate({
      id: selectedCode.id,
      usage_limit: editUsageLimit ? parseInt(editUsageLimit) : undefined,
      expires_at: editExpiresAt || undefined,
    });
  };

  const filteredCodes = discountCodes?.filter(code => {
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && code.is_active) ||
      (statusFilter === 'inactive' && !code.is_active);
    const typeMatch = typeFilter === 'all' || code.discount_type === typeFilter;
    return statusMatch && typeMatch;
  }) || [];

  const getStatusBadge = (isActive: boolean, expiresAt: string | null) => {
    if (!isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'percentage' 
      ? <Badge variant="outline">Percentage</Badge>
      : <Badge variant="outline">Fixed Amount</Badge>;
  };

  const getSegmentBadge = (segment: string) => {
    const colors = {
      all: 'bg-blue-500',
      new_users: 'bg-green-500',
      returning_users: 'bg-purple-500',
      specific_users: 'bg-orange-500'
    };
    return <Badge className={colors[segment as keyof typeof colors] || 'bg-gray-500'}>
      {segment.replace('_', ' ')}
    </Badge>;
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Discount Codes</h1>
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
          Failed to load discount codes data. You might not have the required permissions.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate summary stats
  const totalCodes = discountCodes?.length || 0;
  const activeCodes = discountCodes?.filter(c => c.is_active).length || 0;
  const totalUsages = discountCodes?.reduce((sum, c) => sum + c.times_used, 0) || 0;
  const totalRevenue = discountCodes?.reduce((sum, c) => sum + Number(c.total_revenue_impact), 0) || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discount Codes Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Discount Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Discount Code</DialogTitle>
              <DialogDescription>
                Create a new discount code for your customers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Discount Code *</Label>
                <Input
                  id="code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE20"
                />
              </div>
              <div>
                <Label htmlFor="type">Discount Type *</Label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">
                  Discount Value * {discountType === 'percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percentage' ? '20' : '50'}
                />
              </div>
              <div>
                <Label htmlFor="segment">User Segment</Label>
                <Select value={userSegment} onValueChange={setUserSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="new_users">New Users</SelectItem>
                    <SelectItem value="returning_users">Returning Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="limit">Usage Limit (optional)</Label>
                <Input
                  id="limit"
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <Label htmlFor="expires">Expires At (optional)</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateDiscount}
                disabled={createDiscountMutation.isPending}
                className="w-full"
              >
                Create Discount Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsages}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-${totalRevenue.toFixed(2)}</div>
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
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discount Codes Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Revenue Impact</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-medium">{code.code}</TableCell>
                  <TableCell>{getTypeBadge(code.discount_type)}</TableCell>
                  <TableCell>
                    {code.discount_type === 'percentage' 
                      ? `${code.discount_value}%`
                      : `$${code.discount_value}`
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(code.is_active, code.expires_at)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{code.times_used} used</div>
                      {code.usage_limit && (
                        <div className="text-muted-foreground">
                          of {code.usage_limit} limit
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getSegmentBadge(code.user_segment)}</TableCell>
                  <TableCell className="text-red-600 font-medium">
                    -${code.total_revenue_impact.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {code.expires_at 
                      ? format(new Date(code.expires_at), 'MMM d, yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>{format(new Date(code.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(code)}
                        disabled={updateDiscountMutation.isPending}
                      >
                        {code.is_active ? (
                          <ToggleRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ToggleLeft className="h-3 w-3 mr-1" />
                        )}
                        {code.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCode(code);
                              setEditUsageLimit(code.usage_limit?.toString() || '');
                              setEditExpiresAt(code.expires_at ? new Date(code.expires_at).toISOString().slice(0, 16) : '');
                            }}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Discount Code</DialogTitle>
                            <DialogDescription>
                              Update settings for {selectedCode?.code}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-limit">Usage Limit</Label>
                              <Input
                                id="edit-limit"
                                type="number"
                                value={editUsageLimit}
                                onChange={(e) => setEditUsageLimit(e.target.value)}
                                placeholder="Leave empty for unlimited"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-expires">Expires At</Label>
                              <Input
                                id="edit-expires"
                                type="datetime-local"
                                value={editExpiresAt}
                                onChange={(e) => setEditExpiresAt(e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={handleEditDiscount}
                              disabled={updateDiscountMutation.isPending}
                              className="w-full"
                            >
                              Update Discount Code
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

export default DiscountsPage;
