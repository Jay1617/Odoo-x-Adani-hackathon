import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { maintenanceService } from "@/services/maintenance.service";
import { categoryService } from "@/services/category.service";
import { equipmentService } from "@/services/equipment.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Loader } from "@/components/common/Loader";
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp } from "lucide-react";

export const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    requests: [] as any[],
    teams: [] as any[],
    equipment: [] as any[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requests, teams, equipment] = await Promise.all([
        maintenanceService.getAll(),
        categoryService.getAll(),
        equipmentService.getAll()
      ]);
      setData({ requests, teams, equipment });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader size="lg" /></div>;

  // Process Status Data for Pie Chart
  const statusCounts = data.requests.reduce((acc: any, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});
  
  const statusData = [
    { name: 'New', value: statusCounts['NEW'] || 0, color: 'oklch(0.55 0.15 240)' },
    { name: 'In Progress', value: statusCounts['IN_PROGRESS'] || 0, color: 'oklch(0.65 0.15 60)' },
    { name: 'Repaired', value: statusCounts['REPAIRED'] || 0, color: 'oklch(0.6 0.15 150)' },
    { name: 'Scrap', value: statusCounts['SCRAP'] || 0, color: 'oklch(0.6 0.15 20)' }
  ].filter(d => d.value > 0);

  // Process Team Workload for Bar Chart
  const teamWorkload = data.teams.map(team => {
    const count = data.requests.filter(r => 
        (r.maintenanceTeamId as any)?._id === team.id || 
        (r.maintenanceTeamId as any)?.id === team.id ||
        r.maintenanceTeamId === team.id
    ).length;
    return {
        name: team.name,
        requests: count
    };
  });

  // Process Priority Data
  const priorityCounts = data.requests.reduce((acc: any, curr) => {
    const p = curr.priority || 'MEDIUM';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const priorityData = [
    { name: 'High', value: priorityCounts['HIGH'] || 0 },
    { name: 'Medium', value: priorityCounts['MEDIUM'] || 0 },
    { name: 'Low', value: priorityCounts['LOW'] || 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          Analytics & Reports
        </h1>
        <p className="text-muted-foreground text-base">Detailed insights into maintenance operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
          <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.requests.length}</div>
              </CardContent>
          </Card>
          <Card className="border-amber-200 dark:border-amber-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {data.requests.filter(r => r.status !== 'REPAIRED' && r.status !== 'SCRAP').length}
                </div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Equipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.equipment.length}</div>
              </CardContent>
          </Card>
          <Card className="border-emerald-200 dark:border-emerald-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {data.requests.length ? Math.round((statusCounts['REPAIRED'] || 0) / data.requests.length * 100) : 0}%
                </div>
              </CardContent>
          </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary"/>
              Request Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="oklch(0.55 0.15 240)"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary"/>
              Workload by Team
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamWorkload}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="requests" fill="oklch(0.55 0.15 240)" name="Requests Assigned" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card className="col-span-2">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary"/>
                  Request Priority Analysis
                </CardTitle>
             </CardHeader>
             <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis type="number" stroke="var(--muted-foreground)" />
                        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)', 
                            border: '1px solid var(--border)',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="value" fill="oklch(0.6 0.15 60)" radius={[0, 4, 4, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
             </CardContent>
        </Card>
      </div>
    </div>
  );
};

