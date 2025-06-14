
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Welcome, {user?.user_metadata.first_name || user?.email}</h1>
        <p className="text-muted-foreground mb-12">This is your personal dashboard. Manage your accounts and settings here.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">My Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You have no trading accounts yet.</p>
              <Button className="mt-4" onClick={() => navigate('/checkout')}>Get Funded</Button>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You have no billing history.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage your profile details here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
