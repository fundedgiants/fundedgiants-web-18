
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("You must be logged in to access this page.");
        navigate('/auth', { state: { from: location }, replace: true });
      } else if (!isAdmin) {
        toast.error("You do not have permission to access this page.");
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <Outlet />;
};

export default AdminRoute;
