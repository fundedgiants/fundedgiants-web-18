
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { format } from 'date-fns';

interface PayoutsTableProps {
  payouts: Database['public']['Tables']['affiliate_payouts']['Row'][];
}

const PayoutsTable = ({ payouts }: PayoutsTableProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requested</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No payouts yet.</TableCell>
              </TableRow>
            )}
            {payouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>{format(new Date(payout.requested_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>{payout.processed_at ? format(new Date(payout.processed_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell>${Number(payout.amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(payout.status)}>{payout.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PayoutsTable;
