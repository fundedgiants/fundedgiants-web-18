
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
    const { user } = useAuth();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
                    <Zap className="h-6 w-6 text-primary" />
                    <span>FundedGaints</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <Link to="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link>
                    <Link to="/about" className="text-muted-foreground hover:text-white transition-colors">About Us</Link>
                    <Link to="/contact" className="text-muted-foreground hover:text-white transition-colors">Contact</Link>
                    <Link to="/faq" className="text-muted-foreground hover:text-white transition-colors">FAQ</Link>
                    <Link to="/affiliate-program" className="text-muted-foreground hover:text-white transition-colors">Affiliate Program</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <Button asChild variant="ghost" className="text-white hover:bg-primary/10 hover:text-primary">
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                            <Button onClick={() => supabase.auth.signOut()} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Logout</Button>
                        </>
                    ) : (
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link to="/auth">Register / Login</Link>
                        </Button>
                    )}
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link to="/checkout">Get Funded</Link>
                    </Button>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-background/90 backdrop-blur-sm border-l-primary/20">
                        <nav className="grid gap-6 text-lg font-medium mt-10">
                            <Link to="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link>
                            <Link to="/about" className="text-muted-foreground hover:text-white transition-colors">About Us</Link>
                            <Link to="/contact" className="text-muted-foreground hover:text-white transition-colors">Contact</Link>
                            <Link to="/faq" className="text-muted-foreground hover:text-white transition-colors">FAQ</Link>
                            <Link to="/affiliate-program" className="text-muted-foreground hover:text-white transition-colors">Affiliate Program</Link>
                            <Separator className="my-2 bg-primary/20" />
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
                                    <Button onClick={() => supabase.auth.signOut()} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full">Logout</Button>
                                </>
                            ) : (
                                <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                                    <Link to="/auth">Register / Login</Link>
                                </Button>
                            )}
                            <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                                <Link to="/checkout">Get Funded</Link>
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};

export default Navigation;
