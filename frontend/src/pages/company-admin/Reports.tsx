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
    { name: 'New', value: statusCounts['NEW'] || 0, color: '#3b82f6' },
    { name: 'In Progress', value: statusCounts['IN_PROGRESS'] || 0, color: '#eab308' },
    { name: 'Repaired', value: statusCounts['REPAIRED'] || 0, color: '#22c55e' },
    { name: 'Scrap', value: statusCounts['SCRAP'] || 0, color: '#ef4444' }
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8" />
          Analytics & Reports
        </h1>
        <p className="text-muted-foreground">Detailed insights into maintenance operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Requests</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.requests.length}</div></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Issues</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-yellow-600">
                  {data.requests.filter(r => r.status !== 'REPAIRED' && r.status !== 'SCRAP').length}
              </div></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Equipments</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{data.equipment.length}</div></CardContent>
          </Card>
          <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Completion Rate</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">
                  {data.requests.length ? Math.round((statusCounts['REPAIRED'] || 0) / data.requests.length * 100) : 0}%
              </div></CardContent>
          </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5"/> Request Status Distribution</CardTitle>
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
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Workload by Team</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamWorkload}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#8884d8" name="Requests Assigned" />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card className="col-span-2">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/> Request Priority Analysis</CardTitle>
             </CardHeader>
             <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
             </CardContent>
        </Card>
      </div>
    </div>
  );
};

