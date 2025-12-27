import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { equipmentService } from "@/services/equipment.service";
import { maintenanceService } from "@/services/maintenance.service";
import { Loader } from "@/components/common/Loader";
import { Wrench, ClipboardList, AlertCircle, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const CompanyAdminDashboard = () => {
  const [stats, setStats] = useState({
    equipment: 0,
    totalRequests: 0,
    openRequests: 0,
    completedRequests: 0,
    inProgressRequests: 0,
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
          openRequests: requests.filter((r) => r.stage === "request_sent" || r.stage === "approved").length,
          inProgressRequests: requests.filter((r) => r.stage === "in_progress" || r.stage === "diagnosis").length,
          completedRequests: requests.filter((r) => r.stage === "repaired" || r.stage === "scrap").length,
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
      <div className="flex items-center justify-center h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  const chartData = [
    { name: "Open", value: stats.openRequests, color: "var(--chart-4)" },
    { name: "In Progress", value: stats.inProgressRequests, color: "var(--chart-2)" },
    { name: "Completed", value: stats.completedRequests, color: "var(--chart-1)" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">Welcome back, here's what's happening today.</p>
        </div>
        <div className="hidden sm:block">
           <span className="inline-flex items-center rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Equipment" 
          value={stats.equipment} 
          icon={Wrench} 
          description="Active assets"
          trend="+2.5% from last month"
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-50 dark:bg-blue-900/10"
        />
        <StatsCard 
          title="Total Requests" 
          value={stats.totalRequests} 
          icon={ClipboardList} 
          description="Maintenance tasks"
          trend="+12% activity"
          color="text-indigo-600 dark:text-indigo-400"
          bg="bg-indigo-50 dark:bg-indigo-900/10"
        />
        <StatsCard 
          title="Pending Actions" 
          value={stats.openRequests} 
          icon={AlertCircle} 
          description="Requires attention"
          trend={stats.openRequests > 5 ? "High Load" : "Normal"}
          color="text-amber-600 dark:text-amber-400"
          bg="bg-amber-50 dark:bg-amber-900/10"
        />
        <StatsCard 
          title="Completed" 
          value={stats.completedRequests} 
          icon={CheckCircle2} 
          description="Resolved issues"
          trend="94% success rate"
          color="text-emerald-600 dark:text-emerald-400"
          bg="bg-emerald-50 dark:bg-emerald-900/10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-md bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle>Request Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex items-center justify-center">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                  <Activity className="h-8 w-8 opacity-20" />
                  <p>No data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-none shadow-md bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-background/50 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Add Equipment</h4>
                    <p className="text-xs text-muted-foreground">Register a new asset</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-background/50 flex items-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">View Reports</h4>
                    <p className="text-xs text-muted-foreground">Maintenance analytics</p>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function StatsCard({ title, value, icon: Icon, description, trend, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-md ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <p className="text-xs text-muted-foreground">
            <span className="text-emerald-600 font-medium">{trend}</span>
            </p>
        </div>
        
      </CardContent>
    </Card>
  );
}

