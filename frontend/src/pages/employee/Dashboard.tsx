import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatsCard } from "@/components/common/StatsCard";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, AlertCircle, CheckCircle2, User, Building2, Wrench, Clock, Activity, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
      try {
          await maintenanceService.updateStatus(taskId, newStatus as any);
          toast.success("Status updated");
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
      <div className="flex items-center justify-center h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  const companyName = typeof user?.companyId === 'object' && user.companyId ? (user.companyId as any).name : '';

  // Maintenance Team View
  if (user?.role === "MAINTENANCE_TEAM" && dashboardData) {
      const pieData = [
          { name: "Active", value: dashboardData.assignedToMe, color: "var(--chart-1)" },
          { name: "Unclaimed", value: dashboardData.teamUnassigned, color: "var(--chart-4)" },
          { name: "Done", value: dashboardData.completedByMe, color: "var(--chart-2)" },
      ].filter(d => d.value > 0);

      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b pb-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <Wrench className="h-7 w-7 text-primary" />
                Maintenance Hub
                </h1>
                <p className="text-muted-foreground text-sm">Manage tasks and track performance.</p>
            </div>
             <div className="hidden sm:block">
                 <Badge variant="outline" className="px-3 py-1 border-muted-foreground/30 text-muted-foreground font-normal">
                    {user.name} • Maintenance Specialist
                 </Badge>
             </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="My Active Tasks" 
              value={dashboardData.assignedToMe || 0} 
              icon={ClipboardList} 
              description="Assigned to you"
              color="text-blue-600 dark:text-blue-400"
              bg="bg-blue-50 dark:bg-blue-900/10"
            />
            <StatsCard 
              title="Team Unclaimed" 
              value={dashboardData.teamUnassigned || 0} 
              icon={AlertCircle} 
              description="Needs assignment"
              color="text-amber-600 dark:text-amber-400"
              bg="bg-amber-50 dark:bg-amber-900/10"
            />
             <StatsCard 
              title="Completed By Me" 
              value={dashboardData.completedByMe || 0} 
              icon={CheckCircle2} 
              description="This month" // Assuming
              color="text-emerald-600 dark:text-emerald-400"
              bg="bg-emerald-50 dark:bg-emerald-900/10"
            />
            <div className="hidden lg:block">
                 <Card className="border-none shadow-sm bg-card ring-1 ring-border/50 h-full flex flex-col justify-center">
                    <CardContent className="p-0 h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={40} dataKey="value">
                                     {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                     ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Active Priority Tasks
            </h2>
            
            {!dashboardData.activeTasks || dashboardData.activeTasks.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="All Caught Up" description="You have no active tasks assigned." />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dashboardData.activeTasks.map((task: any) => (
                        <Card key={task._id} className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/50">
                            <CardContent className="p-5 space-y-4">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                         <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{task.priority || "Normal"}</Badge>
                                         <span className="text-xs text-muted-foreground">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2" title={task.subject}>
                                        {task.subject}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                        <Wrench className="h-3.5 w-3.5" />
                                        <span>{task.equipmentId?.name || "Unknown Equipment"}</span>
                                    </div>
                                </div>
                                
                                <div className="pt-3 border-t flex items-center justify-between">
                                     <label className="text-xs font-medium text-muted-foreground">Status:</label>
                                     <select 
                                        className="h-8 rounded-md border border-input bg-background/50 px-2 text-xs font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer hover:bg-accent"
                                        value={task.status}
                                        onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                     >
                                         <option value="NEW">New</option>
                                         <option value="IN_PROGRESS">In Progress</option>
                                         <option value="REPAIRED">Repaired</option>
                                         <option value="SCRAP">Scrap</option>
                                     </select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
          </div>
        </div>
      );
  }

  // Regular Employee View
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="space-y-1">
           <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
             <User className="h-7 w-7 text-primary" />
             Employee Portal
           </h1>
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Welcome back, <span className="font-semibold text-foreground">{user?.name}</span></span>
              {companyName && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:flex items-center gap-1"><Building2 className="h-3 w-3" /> {companyName}</span>
                  </>
              )}
           </div>
        </div>
        <div className="hidden sm:block">
            <div className="text-right">
                <p className="text-sm font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</p>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard 
            title="My Requests" 
            value={dashboardData?.myRequests || 0} 
            icon={ClipboardList} 
            description="Active tickets"
            color="text-primary"
            bg="bg-primary/10"
        />
        <StatsCard 
            title="Open" 
            value={dashboardData?.openRequests || 0} 
            icon={AlertCircle} 
            description="Pending resolution"
            color="text-amber-600 dark:text-amber-400"
            bg="bg-amber-50 dark:bg-amber-900/10"
        />
        <StatsCard 
            title="Resolved" 
            value={dashboardData?.completedRequests || 0} 
            icon={CheckCircle2} 
            description="Successfully closed"
            color="text-emerald-600 dark:text-emerald-400"
            bg="bg-emerald-50 dark:bg-emerald-900/10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-transparent">
             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                     <Wrench className="h-5 w-5 text-primary" />
                     Quick Maintenance Request
                 </CardTitle>
                 <CardDescription>
                     Report a faulty equipment or request service immediately.
                 </CardDescription>
             </CardHeader>
             <CardContent>
                 {/* This could be a button to navigate or a mini form. For now, a button.*/}
                 <button className="inline-flex h-10 items-center justify-between whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 w-full group">
                     Create New Request
                     <ClipboardList className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </button>
             </CardContent>
         </Card>
         
         <Card className="border-none shadow-sm">
             <CardHeader>
                 <CardTitle>Recent Activity</CardTitle>
             </CardHeader>
             <CardContent>
                 <div className="text-sm text-muted-foreground text-center py-8">
                     No recent activity to show.
                 </div>
             </CardContent>
         </Card>
      </div>
    </div>
  );
};

