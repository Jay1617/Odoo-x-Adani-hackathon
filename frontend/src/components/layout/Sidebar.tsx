import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Users,
  ClipboardList,
  Calendar,
  BarChart3,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const getNavItems = (role: string): NavItem[] => {
  if (role === "PLATFORM_ADMIN") {
    return [
      { label: "Dashboard", path: "/main-admin/dashboard", icon: LayoutDashboard },
      { label: "Companies", path: "/main-admin/companies", icon: Building2 },
    ];
  }

  if (role === "COMPANY_ADMIN") {
    return [
      { label: "Dashboard", path: "/company-admin/dashboard", icon: LayoutDashboard },
      { label: "Equipment", path: "/company-admin/equipment", icon: Building2 },
      { label: "Employees", path: "/company-admin/users", icon: Users },
      { label: "Categories", path: "/company-admin/categories", icon: Wrench },
      { label: "Maintenance Requests", path: "/company-admin/maintenance-requests", icon: ClipboardList },
      { label: "Preventive Schedule", path: "/company-admin/preventive-schedule", icon: Calendar },
      { label: "Reports", path: "/company-admin/reports", icon: BarChart3 },
    ];
  }

  // Employee & Maintenance Team
  const items: NavItem[] = [
    { label: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { label: "My Requests", path: "/employee/my-requests", icon: FileText },
  ];

  if (role === "MAINTENANCE_TEAM") {
    items.push({ label: "Team Tasks", path: "/employee/team-tasks", icon: ClipboardList });
    items.push({ label: "Kanban", path: "/employee/kanban", icon: Calendar }); // Kanban usually relevant for team
  } else {
     // Normal employee kanban might not be needed or just for their requests? 
     // Requirement said "Employee & Maintenance Team" share layout. 
     // Let's keep Kanban as previously defined but maybe clearer to have Team Tasks.
     items.push({ label: "Kanban", path: "/employee/kanban", icon: ClipboardList });
  }

  return items;
};

export const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUI();
  const location = useLocation();

  if (!user) return null;

  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
                GearGuard
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden -mr-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary shadow-sm ring-1 ring-sidebar-border"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground")} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border/50">
            <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/30 p-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary/10 text-sidebar-primary font-bold border border-sidebar-primary/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate font-medium">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

