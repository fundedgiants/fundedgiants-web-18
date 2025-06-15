
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-white">
      <main className="container mx-auto flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
