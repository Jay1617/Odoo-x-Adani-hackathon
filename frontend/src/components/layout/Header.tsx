import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { toast } from "react-hot-toast";

export const Header = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user?.name}
        </span>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

