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
  
  // Role update state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState<{
    userId: string;
    currentRole: string;
    newRole: string;
    maintenanceTeamId?: string;
  } | null>(null);

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

  const handleRoleChange = async () => {
    if (!roleChangeData) return;

    try {
      await employeeService.updateRole(
        roleChangeData.userId,
        roleChangeData.newRole as any,
        roleChangeData.maintenanceTeamId
      );
      toast.success("User role updated successfully");
      setRoleDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update user role");
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
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Employee Management
          </h1>
          <p className="text-muted-foreground text-base">Manage employees and assign them to maintenance categories</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="relative max-w-md">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <Card key={(user as any)._id} className="hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                            <Badge className={getRoleBadgeColor(user.role)} variant="secondary">
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {user.role.replace("_", " ")}
                            </Badge>
                            {user.maintenanceTeamId && typeof user.maintenanceTeamId === 'object' && (user.maintenanceTeamId as any).name && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Wrench className="h-3 w-3" />
                                    {(user.maintenanceTeamId as any).name}
                                </Badge>
                            )}
                        </div>
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
                    {user.maintenanceTeamId && typeof user.maintenanceTeamId === 'object' && (user.maintenanceTeamId as any).name && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wrench className="h-4 w-4" />
                        <span>{(user.maintenanceTeamId as any).name}</span>
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
                          onClick={() => {
                            const userObj = user as any;
                            // Fallback to id if _id missing, or vice versa.
                            const userId = userObj._id || userObj.id;
                            if (!userId) {
                                console.error("User ID missing in object:", user);
                                toast.error("Error: User ID missing");
                                return;
                            }

                            const teamId = user.maintenanceTeamId && typeof user.maintenanceTeamId === 'object'
                                ? (user.maintenanceTeamId as any)._id 
                                : user.maintenanceTeamId;
                                
                            setRoleChangeData({
                                userId: userId,
                                currentRole: user.role,
                                newRole: user.role === "EMPLOYEE" ? "MAINTENANCE_TEAM" : "EMPLOYEE",
                                maintenanceTeamId: teamId
                            });
                            setRoleDialogOpen(true);
                          }}
                          className="text-xs"
                        >
                          Switch to {user.role === "EMPLOYEE" ? "Maintenance" : "Employee"}
                        </Button>
                        {user.role === "MAINTENANCE_TEAM" && (
                          <div className="relative">
                              <select
                                className="h-8 text-xs border rounded px-2 pr-8 appearance-none bg-background"
                                value={user.maintenanceTeamId && typeof user.maintenanceTeamId === 'object' ? (user.maintenanceTeamId as any)._id : user.maintenanceTeamId || ""}
                                onChange={async (e) => {
                                  const newTeamId = e.target.value;
                                  if (newTeamId) {
                                    try {
                                        const userObj = user as any;
                                        const userId = userObj._id || userObj.id;
                                        if (!userId) {
                                            toast.error("User ID missing");
                                            return;
                                        }
                                        await employeeService.updateRole(userId, "MAINTENANCE_TEAM", newTeamId);
                                        toast.success("Team assigned successfully");
                                        fetchUsers();
                                    } catch(err: any) {
                                        toast.error(err.message || "Failed to assign team");
                                    }
                                  }
                                }}
                              >
                                <option value="">Assign to Category</option>
                                {teams.map((team) => (
                                  <option key={team._id} value={team._id}>
                                    {team.name}
                                  </option>
                                ))}
                              </select>
                          </div>
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
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader /> : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Role Change</DialogTitle>
                <DialogDescription>
                    Are you sure you want to change this user's role from {roleChangeData?.currentRole} to {roleChangeData?.newRole}?
                </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleRoleChange}>Confirm Change</Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

