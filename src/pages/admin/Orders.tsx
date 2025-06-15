
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
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
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: fetchOrders,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  const totalPages = orders ? Math.ceil(orders.length / ordersPerPage) : 0;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-muted/20">
                <TableHead>User</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order) => (
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
                </TableRow>
              ))}
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
