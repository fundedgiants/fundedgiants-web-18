
import React, { useState, useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
    id: string;
    user_id: string;
    user_email: string;
    program_name: string;
    total_price: number;
    payment_status: string;
    payment_method: string | null;
    payment_provider: string | null;
    created_at: string;
    affiliate_code: string | null;
    applied_discount_code: string | null;
}

const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase.rpc('get_all_orders_with_details');
  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message);
  }
  return (data as Order[]) || [];
};

const updateOrderStatus = async ({ orderId, status }: { orderId: string, status: string }) => {
  const { error } = await supabase.rpc('update_order_payment_status', {
    target_order_id: orderId,
    new_status: status,
  });

  if (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.message);
  }
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
        case 'completed': return 'default';
        case 'pending': return 'secondary';
        case 'failed': return 'destructive';
        case 'refunded': return 'outline';
        case 'cancelled': return 'outline';
        default: return 'secondary';
    }
}

const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: fetchOrders,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'ascending' | 'descending' }>({ key: 'created_at', direction: 'descending' });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderAnalytics'] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to update status: ${err.message}`);
    },
  });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order.user_email.toLowerCase().includes(searchLower) ||
        order.program_name.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const requestSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = useMemo(() => {
    if (!filteredOrders) return [];
    let sortableOrders = [...filteredOrders];
    if (sortConfig !== null) {
        sortableOrders.sort((a, b) => {
            if (a[sortConfig.key] === null || a[sortConfig.key] === undefined) return 1;
            if (b[sortConfig.key] === null || b[sortConfig.key] === undefined) return -1;
            
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableOrders;
  }, [filteredOrders, sortConfig]);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  const totalPages = sortedOrders ? Math.ceil(sortedOrders.length / ordersPerPage) : 0;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders ? sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder) : [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers: (number | string)[] = [];
    pageNumbers.push(1);
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    if (totalPages > 1) {
        pageNumbers.push(totalPages);
    }
    const uniquePageNumbers = [...new Set(pageNumbers)];
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage - 1)}} className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}/>
                </PaginationItem>
                {uniquePageNumbers.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === '...' ? <PaginationEllipsis /> : 
                            <PaginationLink href="#" onClick={(e) => {e.preventDefault(); handlePageChange(page as number)}} isActive={currentPage === page}>
                                {page}
                            </PaginationLink>
                        }
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage + 1)}} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        <Card className="bg-card/30 border-primary/30">
          <CardContent className="p-0">
            <div className="space-y-2 p-6">
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
          Failed to load order data. You might not have the required permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <Card className="bg-card/30 border-primary/30">
        <div className="flex items-center gap-4 p-4 border-b border-primary/20">
          <Input
            placeholder="Search by email, program, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-muted/20">
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('user_email')}>
                    User
                    {sortConfig?.key === 'user_email' ? (
                        sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 inline h-4 w-4" /> : <ArrowDown className="ml-2 inline h-4 w-4" />
                    ) : <ArrowUpDown className="ml-2 inline h-4 w-4 opacity-30" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('program_name')}>
                    Program
                    {sortConfig?.key === 'program_name' ? (
                        sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 inline h-4 w-4" /> : <ArrowDown className="ml-2 inline h-4 w-4" />
                    ) : <ArrowUpDown className="ml-2 inline h-4 w-4 opacity-30" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('total_price')}>
                    Amount
                    {sortConfig?.key === 'total_price' ? (
                        sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 inline h-4 w-4" /> : <ArrowDown className="ml-2 inline h-4 w-4" />
                    ) : <ArrowUpDown className="ml-2 inline h-4 w-4 opacity-30" />}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('created_at')}>
                    Date
                    {sortConfig?.key === 'created_at' ? (
                        sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 inline h-4 w-4" /> : <ArrowDown className="ml-2 inline h-4 w-4" />
                    ) : <ArrowUpDown className="ml-2 inline h-4 w-4 opacity-30" />}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <TableRow key={order.id} className="border-primary/20 hover:bg-muted/20">
                    <TableCell className="font-medium">{order.user_email}</TableCell>
                    <TableCell>{order.program_name}</TableCell>
                    <TableCell>${order.total_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.payment_status)} className={cn("capitalize", {
                        "bg-green-500/20 text-green-500 border-green-500/30": order.payment_status === 'completed',
                      })}>
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.payment_provider || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(order.created_at), 'PPP')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'completed' })}
                            disabled={order.payment_status === 'completed' || updateStatusMutation.isPending}
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'pending' })}
                            disabled={order.payment_status === 'pending' || updateStatusMutation.isPending}
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'failed' })}
                            disabled={order.payment_status === 'failed' || updateStatusMutation.isPending}
                          >
                            Mark as Failed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'refunded' })}
                            disabled={order.payment_status === 'refunded' || updateStatusMutation.isPending}
                          >
                            Mark as Refunded
                          </DropdownMenuItem>
                           <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'cancelled' })}
                            disabled={order.payment_status === 'cancelled' || updateStatusMutation.isPending}
                          >
                            Mark as Cancelled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="justify-center border-t border-primary/20 pt-4">
             {renderPagination()}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;
