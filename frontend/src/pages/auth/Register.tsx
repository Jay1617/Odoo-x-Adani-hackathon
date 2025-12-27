import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { companyService } from "@/services/company.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/common/Loader";
import { toast } from "react-hot-toast";
import { UserPlus, Shield, Mail, Lock, User, Phone, Building2 } from "lucide-react";
import type { Role } from "@/types/user";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE" as Role,
    phone: "",
    companyId: "",
  });
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
        try {
            const data = await companyService.getPublic();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies");
        }
    };
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      // If COMPANY_ADMIN, include company details
      if (formData.role === "COMPANY_ADMIN") {
        (registerData as any).companyDetails = companyDetails;
      } else if (formData.role === "EMPLOYEE") {
         (registerData as any).companyId = formData.companyId;
      }
      
      const response = await authService.register(registerData);
      login(response);
      toast.success("Account created successfully");
      
      // Navigate based on role
      const rolePath: Record<string, string> = {
        PLATFORM_ADMIN: "/main-admin/dashboard",
        COMPANY_ADMIN: "/company-admin/dashboard",
        MAINTENANCE_TEAM: "/employee/dashboard",
        EMPLOYEE: "/employee/dashboard",
      };
      navigate(rolePath[response.user.role] || "/login");
    } catch (error: any) {
      toast.error(error.message || error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "COMPANY_ADMIN", label: "Company Admin", icon: Building2, desc: "Register your company and manage employees" },
    { value: "EMPLOYEE", label: "Employee", icon: User, desc: "Join as an employee (company admin will assign you)" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-2">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-black dark:bg-white p-3">
              <Shield className="h-8 w-8 text-white dark:text-black" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black dark:text-white">Create Account</CardTitle>
          <CardDescription className="text-base">Join GearGuard Maintenance Tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_id" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email_id"
                type="email"
                placeholder="you@example.com"
                value={formData.email_id}
                onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: option.value as Role })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5" />
                        <span className="font-semibold">{option.label}</span>
                      </div>
                      <p className="text-xs opacity-80">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company Selection - Only for EMPLOYEE/MAINTENANCE_TEAM */}
            {formData.role === "EMPLOYEE" && (
              <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Select Company
                </h3>
                  <div className="space-y-2">
                    <Label htmlFor="companyId">Company *</Label>
                    <select
                      id="companyId"
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.companyId || ""}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select a company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">Select the company you work for.</p>
                  </div>
              </div>
            )}

            {/* Company Details Form - Only for COMPANY_ADMIN */}
            {formData.role === "COMPANY_ADMIN" && (
              <div className="space-y-4 p-4 border-2 border-black dark:border-white rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={companyDetails.name}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                      required
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyDetails.email}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                      placeholder="company@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      type="tel"
                      value={companyDetails.phone}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyCity">City</Label>
                    <Input
                      id="companyCity"
                      value={companyDetails.address.city}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          address: { ...companyDetails.address, city: e.target.value },
                        })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyState">State</Label>
                    <Input
                      id="companyState"
                      value={companyDetails.address.state}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          address: { ...companyDetails.address, state: e.target.value },
                        })
                      }
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPostalCode">Postal Code</Label>
                    <Input
                      id="companyPostalCode"
                      value={companyDetails.address.postalCode}
                      onChange={(e) =>
                        setCompanyDetails({
                          ...companyDetails,
                          address: { ...companyDetails.address, postalCode: e.target.value },
                        })
                      }
                      placeholder="Postal Code"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyStreet">Street Address</Label>
                  <Input
                    id="companyStreet"
                    value={companyDetails.address.street}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        address: { ...companyDetails.address, street: e.target.value },
                      })
                    }
                    placeholder="Street Address"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black" disabled={loading}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-black dark:text-white hover:underline">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
