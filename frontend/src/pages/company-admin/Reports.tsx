import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analytics and insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Maintenance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Reports and analytics will be displayed here. This can include:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Number of requests per team</li>
            <li>Number of requests per equipment category</li>
            <li>Average repair duration</li>
            <li>Equipment utilization</li>
            <li>Maintenance costs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

