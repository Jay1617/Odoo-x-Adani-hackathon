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
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          Dashboard
        </h1>
        <p className="text-muted-foreground text-base">Company Overview & Analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Equipment</CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.equipment}</div>
            <p className="text-xs text-muted-foreground">Total assets</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-amber-200 dark:border-amber-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Requests</CardTitle>
            <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1 text-amber-600 dark:text-amber-400">{stats.openRequests}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-emerald-200 dark:border-emerald-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

