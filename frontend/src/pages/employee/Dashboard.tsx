import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { ClipboardList, AlertCircle, CheckCircle, User, Building2, Wrench } from "lucide-react";
import { toast } from "react-hot-toast";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  // Consolidate state into a single object or keep separate but unconditional
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Status update handler (universal for maintenance team)
  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
      try {
          await maintenanceService.updateStatus(taskId, newStatus as any);
          toast.success("Status updated");
          // Refresh data
          fetchData();
      } catch(e) {
          toast.error("Failed to update status");
      }
  }

  const fetchData = async () => {
      try {
          const data = await maintenanceService.getDashboardStats();
          setDashboardData(data);
      } catch (error) {
          console.error("Failed to fetch stats:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  const companyName = typeof user?.companyId === 'object' && user.companyId ? (user.companyId as any).name : '';

  // Render Maintenance Team View
  if (user?.role === "MAINTENANCE_TEAM" && dashboardData) {
      return (
        <div className="space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary" />
              Maintenance Dashboard
            </h1>
            <p className="text-muted-foreground text-base">Overview of your maintenance tasks</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="relative overflow-hidden border border-blue-200 dark:border-blue-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 text-blue-600 dark:text-blue-400">{dashboardData.assignedToMe || 0}</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border border-amber-200 dark:border-amber-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Unclaimed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 text-amber-600 dark:text-amber-400">{dashboardData.teamUnassigned || 0}</div>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border border-emerald-200 dark:border-emerald-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed by Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">{dashboardData.completedByMe || 0}</div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mt-6">My Active Priority List</h2>
          {!dashboardData.activeTasks || dashboardData.activeTasks.length === 0 ? (
              <EmptyState icon={CheckCircle} title="All Caught Up" description="You have no active tasks assigned." />
          ) : (
              <div className="grid gap-4">
                  {dashboardData.activeTasks.map((task: any) => (
                      <Card key={task._id} className="p-4 flex items-center justify-between">
                          <div>
                              <h3 className="font-semibold">{task.subject}</h3>
                              <p className="text-sm text-muted-foreground">{task.equipmentId?.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                               <select 
                                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                  value={task.status}
                                  onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                               >
                                   <option value="NEW">New</option>
                                   <option value="IN_PROGRESS">In Progress</option>
                                   <option value="REPAIRED">Repaired</option>
                                   <option value="SCRAP">Scrap</option>
                               </select>
                          </div>
                      </Card>
                  ))}
              </div>
          )}
        </div>
      );
  }

  // Render Regular Employee View
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Dashboard
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2 text-muted-foreground">
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
        <Card className="relative overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Requests</CardTitle>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{dashboardData?.myRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Assigned to me</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-amber-200 dark:border-amber-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
            <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1 text-amber-600 dark:text-amber-400">{dashboardData?.openRequests || 0}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
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
            <div className="text-3xl font-bold mb-1 text-emerald-600 dark:text-emerald-400">{dashboardData?.completedRequests || 0}</div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

