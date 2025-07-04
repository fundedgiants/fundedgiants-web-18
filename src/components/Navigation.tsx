
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Zap, ChevronDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const Navigation = () => {
    const { user, isAdmin } = useAuth();
    
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error(error.message);
        } else {
            toast.success("You have been logged out.");
        }
    }

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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-white hover:bg-primary/10 hover:text-primary">
                                Dashboard <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-background/90 backdrop-blur-sm border-primary/20 text-white">
                            <DropdownMenuItem disabled className="cursor-not-allowed text-muted-foreground focus:bg-accent/50">
                                Trading Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent/50">
                                <Link to={user ? "/affiliate-portal" : "/auth"}>Affiliate Portal</Link>
                            </DropdownMenuItem>
                            {isAdmin && (
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent/50">
                                    <Link to="/faith">Admin Panel</Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <Button onClick={handleSignOut} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Logout</Button>
                    ) : (
                        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            <Link to="/auth">Client Login</Link>
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

                            <span className="text-muted-foreground cursor-not-allowed">Trading Dashboard</span>
                            <Link to={user ? "/affiliate-portal" : "/auth"} className="text-muted-foreground hover:text-white transition-colors">Affiliate Portal</Link>
                            
                            {isAdmin && (
                                <Link to="/faith" className="text-muted-foreground hover:text-white transition-colors">Admin Panel</Link>
                            )}
                            
                            <Separator className="my-2 bg-primary/20" />

                            {user ? (
                                <Button onClick={handleSignOut} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full">Logout</Button>
                            ) : (
                                 <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                                    <Link to="/auth">Client Login</Link>
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
