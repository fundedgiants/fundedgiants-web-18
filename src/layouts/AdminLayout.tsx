
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="bg-card/20 border-b border-primary/20 sticky top-16 z-40">
        <nav className="container mx-auto flex items-center gap-6 p-4">
          <NavLink
            to="/faith"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/faith/users"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/faith/orders"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            Orders
          </NavLink>
        </nav>
      </header>
      <main className="container mx-auto flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
