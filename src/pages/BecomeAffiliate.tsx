
import AffiliateApplicationForm from "@/components/affiliate/AffiliateApplicationForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

const BecomeAffiliate = () => {
    return (
        <div className="container mx-auto max-w-2xl py-8">
             <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl">Become an Affiliate</CardTitle>
                    <CardDescription>
                        Join our affiliate program and earn commissions by promoting our products.
                        Fill out the form below to apply.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AffiliateApplicationForm />
                     <p className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{' '}
                        <Link to="/auth" className="underline text-primary hover:text-primary/80">
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default BecomeAffiliate;
