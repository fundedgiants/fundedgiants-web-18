
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    // More items will be added in later phases
  ];

  const baseClasses = "flex items-center gap-3 rounded-lg px-3 py-2 transition-all";
  const activeClasses = "bg-primary/20 text-primary";
  const inactiveClasses = "text-muted-foreground hover:text-primary";

  return (
    <aside className="hidden w-64 flex-col border-r border-primary/20 bg-muted/20 md:flex">
      <div className="flex h-16 items-center border-b border-primary/20 px-6">
        <NavLink to="/admin" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span>Admin Panel</span>
        </NavLink>
      </div>
      <div className="flex-1">
        <nav className="grid items-start gap-1 p-4 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) => cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
              end={item.href === '/admin'}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
