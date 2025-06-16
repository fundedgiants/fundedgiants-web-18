
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AdminDiagnostics: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  const { data: adminCheck, error: adminCheckError } = useQuery({
    queryKey: ['adminCheck'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_current_user_admin');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userRoles, error: userRolesError } = useQuery({
    queryKey: ['currentUserRoles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return <div>Loading diagnostics...</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">User ID:</label>
            <p className="text-sm text-muted-foreground">{user?.id || 'Not logged in'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">User Email:</label>
            <p className="text-sm text-muted-foreground">{user?.email || 'Not logged in'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">isAdmin (hook):</label>
            <Badge variant={isAdmin ? 'default' : 'secondary'}>
              {isAdmin ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium">Admin Check (RPC):</label>
            <Badge variant={adminCheck ? 'default' : 'secondary'}>
              {adminCheckError ? 'Error' : adminCheck ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">User Roles:</label>
          <div className="flex gap-2 mt-1">
            {userRolesError ? (
              <Badge variant="destructive">Error loading roles</Badge>
            ) : userRoles && userRoles.length > 0 ? (
              userRoles.map((role, index) => (
                <Badge key={index} variant="outline">{role.role}</Badge>
              ))
            ) : (
              <Badge variant="secondary">No roles assigned</Badge>
            )}
          </div>
        </div>

        {adminCheckError && (
          <div>
            <label className="text-sm font-medium text-red-500">Admin Check Error:</label>
            <p className="text-sm text-red-500">{adminCheckError.message}</p>
          </div>
        )}

        {userRolesError && (
          <div>
            <label className="text-sm font-medium text-red-500">User Roles Error:</label>
            <p className="text-sm text-red-500">{userRolesError.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDiagnostics;
