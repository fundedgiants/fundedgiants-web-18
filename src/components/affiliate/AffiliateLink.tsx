
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface AffiliateLinkProps {
  affiliateCode: string;
}

const AffiliateLink = ({ affiliateCode }: AffiliateLinkProps) => {
  const affiliateLink = `${window.location.origin}/?ref=${affiliateCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success("Affiliate link copied to clipboard!");
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle>Your Affiliate Link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input value={affiliateLink} readOnly className="bg-background/50" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Share this link to earn commissions on referrals.
        </p>
      </CardContent>
    </Card>
  );
};

export default AffiliateLink;
