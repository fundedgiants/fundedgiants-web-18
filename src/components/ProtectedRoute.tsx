
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /affiliate-portal page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they log in.
    return <Navigate to="/affiliate-portal" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
