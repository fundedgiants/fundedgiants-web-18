
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";
import { format } from 'date-fns';

type Referral = Database['public']['Tables']['affiliate_referrals']['Row'] & {
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

interface ReferralsTableProps {
  referrals: Referral[];
}

const ReferralsTable = ({ referrals }: ReferralsTableProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle>Recent Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Referred User</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No referrals yet.</TableCell>
              </TableRow>
            )}
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{format(new Date(referral.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>{referral.profiles?.first_name || 'N/A'}</TableCell>
                <TableCell>${Number(referral.commission_amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(referral.status)}>{referral.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReferralsTable;
