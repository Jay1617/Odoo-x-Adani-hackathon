import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  trend?: string;
  color?: string;
  bg?: string;
}

export function StatsCard({ title, value, icon: Icon, description, trend, color, bg }: StatsCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-md ${bg ? bg : 'bg-primary/10'}`}>
          <Icon className={`h-4 w-4 ${color ? color : 'text-primary'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
             {trend && <TrendingUp className="h-3 w-3 text-emerald-500" />}
             <p className="text-xs text-muted-foreground">
               {trend && <span className="text-emerald-600 font-medium mr-1">{trend}</span>}
               {description}
             </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
