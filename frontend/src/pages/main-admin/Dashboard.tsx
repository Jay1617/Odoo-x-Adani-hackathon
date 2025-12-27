import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyService } from "@/services/company.service";
import { equipmentService } from "@/services/equipment.service";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { Building2, Wrench, ClipboardList, Shield, Activity } from "lucide-react";

export const MainAdminDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    equipment: 0,
    requests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [companies, equipment, requests] = await Promise.all([
          companyService.getAll(),
          equipmentService.getAll(),
          maintenanceService.getAll(),
        ]);
        setStats({
          companies: companies.length,
          equipment: equipment.length,
          requests: requests.length,
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
          <Shield className="h-8 w-8" />
          Platform Dashboard
        </h1>
        <p className="text-muted-foreground">System-wide Overview & Analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <div className="p-2 rounded-full bg-black dark:bg-white">
              <Building2 className="h-4 w-4 text-white dark:text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.companies}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered companies</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <div className="p-2 rounded-full bg-black dark:bg-white">
              <Wrench className="h-4 w-4 text-white dark:text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.equipment}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all companies</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
            <div className="p-2 rounded-full bg-black dark:bg-white">
              <ClipboardList className="h-4 w-4 text-white dark:text-black" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.requests}</div>
            <p className="text-xs text-muted-foreground mt-1">All requests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

