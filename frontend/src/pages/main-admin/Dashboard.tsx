import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyService } from "@/services/company.service";
import { equipmentService } from "@/services/equipment.service";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { Building2, Wrench, ClipboardList, Shield} from "lucide-react";

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
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Platform Dashboard
        </h1>
        <p className="text-muted-foreground text-base">System-wide Overview & Analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.companies}</div>
            <p className="text-xs text-muted-foreground">Registered companies</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.equipment}</div>
            <p className="text-xs text-muted-foreground">Across all companies</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Requests</CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stats.requests}</div>
            <p className="text-xs text-muted-foreground">All requests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

