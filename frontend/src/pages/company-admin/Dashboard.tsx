import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { equipmentService } from "@/services/equipment.service";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { Wrench, ClipboardList, AlertCircle, CheckCircle, TrendingUp, Activity } from "lucide-react";

export const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState({
    equipment: 0,
    totalRequests: 0,
    openRequests: 0,
    completedRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [equipment, requests] = await Promise.all([
          equipmentService.getAll(),
          maintenanceService.getAll(),
        ]);
        setStats({
          equipment: equipment.length,
          totalRequests: requests.length,
          openRequests: requests.filter((r) => r.stage !== "repaired" && r.stage !== "scrap").length,
          completedRequests: requests.filter((r) => r.stage === "repaired").length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8" />
          Dashboard
        </h1>
        <p className="text-muted-foreground">Company Overview & Analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <div className="p-2 rounded-full bg-black dark:bg-white">
              <Wrench className="h-4 w-4 text-white dark:text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.equipment}</div>
            <p className="text-xs text-muted-foreground mt-1">Total assets</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <div className="p-2 rounded-full bg-black dark:bg-white">
              <ClipboardList className="h-4 w-4 text-white dark:text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
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
            <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

