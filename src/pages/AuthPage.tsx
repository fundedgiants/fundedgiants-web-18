
import Auth from '@/components/Auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-background bg-stars flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cosmic-gradient"></div>
      <Card className="w-full max-w-md z-10 bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Affiliate Portal</CardTitle>
          <CardDescription>
            Login to access your affiliate dashboard and track your earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth embedded={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
