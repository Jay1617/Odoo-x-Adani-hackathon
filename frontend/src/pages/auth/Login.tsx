import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/common/Loader";
import { toast } from "react-hot-toast";
import { LogIn, Shield, Mail, Lock } from "lucide-react";

export const Login = () => {
  const [email_id, setEmail_id] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email_id, password });
      login(response);
      toast.success("Logged in successfully");
      
      // Navigate based on role
      const rolePath: Record<string, string> = {
        PLATFORM_ADMIN: "/main-admin/dashboard",
        COMPANY_ADMIN: "/company-admin/dashboard",
        MAINTENANCE_TEAM: "/employee/dashboard",
        EMPLOYEE: "/employee/dashboard",
      };
      navigate(rolePath[response.user.role] || "/login");
    } catch (error: any) {
      toast.error(error.message || error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary p-3 shadow-md">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">GearGuard</CardTitle>
          <CardDescription className="text-base">The Ultimate Maintenance Tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email_id" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email_id"
                type="email"
                placeholder="you@example.com"
                value={email_id}
                onChange={(e) => setEmail_id(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline transition-colors">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

