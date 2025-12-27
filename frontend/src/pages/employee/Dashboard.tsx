import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { ClipboardList, AlertCircle, CheckCircle, User, Building2 } from "lucide-react";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myRequests: 0,
    openRequests: 0,
    completedRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const requests = await maintenanceService.getAll();
        const myRequests = requests.filter((r) => r.assignedTo?._id === user?.id);
        const open = myRequests.filter((r) => r.status !== "REPAIRED" && r.status !== "SCRAP").length;
        const completed = myRequests.filter((r) => r.status === "REPAIRED").length;
        setStats({
          myRequests: myRequests.length,
          openRequests: open,
          completedRequests: completed,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  // Handle company display safely (checking if companyId is populated object)
  const companyName = typeof user?.companyId === 'object' && user.companyId ? (user.companyId as any).name : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Dashboard
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 text-muted-foreground mt-2">
           <p>Welcome back, <span className="font-semibold text-foreground">{user?.name}</span></p>
           {companyName && (
             <>
                <span className="hidden md:inline">•</span>
                <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {companyName}
                </p>
             </>
           )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">My Requests</CardTitle>
            <div className="p-3 rounded-xl bg-black dark:bg-white shadow-lg">
              <ClipboardList className="h-5 w-5 text-white dark:text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.myRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned to me</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

