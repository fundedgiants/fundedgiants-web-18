
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Award, TrendingUp, Rocket, Star, DollarSign, Ban } from "lucide-react";

const tiers = [
  {
    icon: Award,
    title: "Tier 1: Bronze Partner",
    commission: "5% recurrent commission",
    sales: "$0 - $5,000 in sales",
    bonus: "$5,000 Zeus Trader account bonus",
    promotion: "Upon completion, graduate to Tier 3!",
    withdrawal: "Monthly withdrawals",
    color: "bg-orange-400/10 border-orange-400/40",
    iconColor: "text-orange-400"
  },
  {
    icon: TrendingUp,
    title: "Tier 2: Silver Partner",
    commission: "7.5% recurrent commission",
    sales: "$5,001 - $10,000 in sales",
    bonus: "$10,000 Orion Challenge account bonus",
    promotion: "Complete this tier to unlock more rewards.",
    withdrawal: "Bi-weekly withdrawals",
    color: "bg-slate-400/10 border-slate-400/40",
    iconColor: "text-slate-400"
  },
  {
    icon: Rocket,
    title: "Tier 3: Gold Partner",
    commission: "10% recurrent commission",
    sales: "$10,001 - $25,000 in sales",
    bonus: "$10,000 Heracles Program account bonus",
    promotion: "Reach this tier to be considered for exclusive partnership.",
    withdrawal: "Weekly withdrawals",
    color: "bg-amber-400/10 border-amber-400/40",
    iconColor: "text-amber-400"
  }
];

const exclusivePerks = [
  "Performance-based monthly salary",
  "Monthly giveaway accounts for your audience",
  "On-demand trading accounts (quarterly)",
  "Daily withdrawals",
  "Dedicated support & strategy calls",
];

const AffiliateProgram = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
          Join Our Affiliate Program
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Partner with FundedGaints and earn generous commissions by promoting a platform trusted by traders worldwide.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Commission Tiers & Rewards</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card key={tier.title} className={`flex flex-col ${tier.color} bg-card/50 backdrop-blur-sm`}>
              <CardHeader className="flex-row items-center gap-4">
                <tier.icon className={`h-10 w-10 ${tier.iconColor}`} />
                <div>
                  <CardTitle>{tier.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> <span><strong>Commission:</strong> {tier.commission}</span></p>
                <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> <span><strong>Sales Target:</strong> {tier.sales} (monthly or 3-month cumulative)</span></p>
                <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> <span><strong>Bonus:</strong> {tier.bonus}</span></p>
                <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> <span><strong>Withdrawal:</strong> {tier.withdrawal}</span></p>
                <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" /> {tier.promotion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <Card className="bg-primary/5 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Star className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Become an Exclusive Partner</CardTitle>
                <CardDescription className="text-muted-foreground max-w-xl mx-auto">
                    Top performers who exceed Tier 3 are invited to our exclusive partnership program with unparalleled benefits.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {exclusivePerks.map((perk, index) => (
                        <li key={index} className="flex items-center text-left">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                            <span>{perk}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Program Rules</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex-row items-center gap-4">
                <DollarSign className="h-8 w-8 text-primary"/>
                <CardTitle>Minimum Payout</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">A minimum balance of <strong className="text-foreground">$150</strong> is required for withdrawal requests.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="flex-row items-center gap-4">
                <Ban className="h-8 w-8 text-destructive"/>
                <CardTitle>Self-Referrals</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Commissions cannot be earned on your own purchases.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="text-center">
        <h2 className="text-3xl font-bold">Ready to Start Earning?</h2>
        <p className="mt-2 text-lg text-muted-foreground">Join our community of partners today and turn your influence into income.</p>
        <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90">
          <Link to="/affiliate-portal">Join The Program Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default AffiliateProgram;
