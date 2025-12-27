import { useEffect, useState } from "react";
import { type User } from "@/types/user";
import { employeeService } from "@/services/employee.service";
import { categoryService } from "@/services/category.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Users, Search, UserPlus, Wrench, Building2, User as UserIcon, Mail, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import type { Role } from "@/types/user";

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    password: "",
    role: "EMPLOYEE" as Role,
    phone: "",
    maintenanceTeamId: "",
  });
  const [teams, setTeams] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error: any) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await categoryService.getAll();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await employeeService.create(formData);
      toast.success("Employee created successfully");
      setDialogOpen(false);
      setFormData({
        name: "",
        email_id: "",
        password: "",
        role: "EMPLOYEE",
        phone: "",
        maintenanceTeamId: "",
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "EMPLOYEE" | "MAINTENANCE_TEAM") => {
    try {
      await employeeService.updateRole(userId, newRole);
      toast.success("Employee role updated successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const handleAssignToCategory = async (employeeId: string, categoryId: string) => {
    try {
      await categoryService.assignEmployee(categoryId, employeeId);
      toast.success("Employee assigned to category successfully");
      fetchUsers();
      fetchTeams();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign employee");
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "COMPANY_ADMIN":
        return Building2;
      case "MAINTENANCE_TEAM":
        return Wrench;
      default:
        return UserIcon;
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case "COMPANY_ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "MAINTENANCE_TEAM":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Employee Management
          </h1>
          <p className="text-muted-foreground">Manage employees and assign them to maintenance categories</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-black dark:bg-white text-white dark:text-black">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={searchTerm ? "Try adjusting your search" : "Get started by adding your first user"}
          action={{ label: "Add User", onClick: () => setDialogOpen(true) }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-black dark:bg-white text-white dark:text-black">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {user.role.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email_id}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.maintenanceTeamId && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wrench className="h-4 w-4" />
                        <span>Assigned to Category</span>
                      </div>
                    )}
                    <div className="pt-2 flex flex-col gap-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user.id, user.role === "EMPLOYEE" ? "MAINTENANCE_TEAM" : "EMPLOYEE")}
                          className="text-xs"
                        >
                          Switch to {user.role === "EMPLOYEE" ? "Maintenance" : "Employee"}
                        </Button>
                        {user.role === "MAINTENANCE_TEAM" && (
                          <Select
                            value={user.maintenanceTeamId || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignToCategory(user.id, e.target.value);
                              }
                            }}
                            className="text-xs h-8"
                          >
                            <option value="">Assign to Category</option>
                            {teams.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>Create a new employee. You can later assign maintenance team members to categories.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_id">Email</Label>
                <Input
                  id="email_id"
                  type="email"
                  value={formData.email_id}
                  onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "EMPLOYEE" | "MAINTENANCE_TEAM" })}
                required
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MAINTENANCE_TEAM">Maintenance Team</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-black dark:bg-white text-white dark:text-black">
                {submitting ? <Loader /> : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

