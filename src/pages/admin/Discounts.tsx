
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { AlertTriangle, Percent, Users, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: discountCodes, isLoading, error } = useQuery<DiscountCodeWithStats[]>({
    queryKey: ['allDiscountCodes'],
    queryFn: fetchDiscountCodes,
  });

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
      <h1 className="text-3xl font-bold mb-6">Discount Codes Management</h1>
      
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
