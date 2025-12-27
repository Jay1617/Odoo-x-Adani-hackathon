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
      { label: "Teams", path: "/company-admin/teams", icon: Users },
      { label: "Users", path: "/company-admin/users", icon: Users },
      { label: "Maintenance Requests", path: "/company-admin/maintenance-requests", icon: ClipboardList },
      { label: "Preventive Schedule", path: "/company-admin/preventive-schedule", icon: Calendar },
      { label: "Reports", path: "/company-admin/reports", icon: BarChart3 },
    ];
  }

  // Employee & Maintenance Team
  return [
    { label: "Dashboard", path: "/employee/dashboard", icon: LayoutDashboard },
    { label: "My Requests", path: "/employee/my-requests", icon: FileText },
    { label: "Kanban", path: "/employee/kanban", icon: ClipboardList },
  ];
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <h1 className="text-lg font-bold text-sidebar-foreground">GearGuard</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user.email_id}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

