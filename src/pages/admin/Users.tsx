
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

interface UserProfile {
  user_id: string;
  email: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country: string | null;
}

const fetchUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase.rpc('get_all_users_with_profiles');

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const UsersPage: React.FC = () => {
  const { data: users, isLoading, error } = useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: fetchUsers,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalPages = users ? Math.ceil(users.length / usersPerPage) : 0;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users ? users.slice(indexOfFirstUser, indexOfLastUser) : [];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    // Always show first page
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

    // Always show last page
    if (totalPages > 1) {
        pageNumbers.push(totalPages);
    }
    
    // Remove duplicates that may occur from the logic above
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
        <h1 className="text-3xl font-bold mb-6">Users</h1>
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
          Failed to load user data. You might not have the required permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <Card className="bg-card/30 border-primary/30">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-primary/20 hover:bg-muted/20">
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.user_id} className="border-primary/20 hover:bg-muted/20">
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.first_name || ''} {user.last_name || ''}</TableCell>
                  <TableCell>{user.country || 'N/A'}</TableCell>
                  <TableCell>{user.phone || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(user.created_at), 'PPP')}</TableCell>
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

export default UsersPage;
