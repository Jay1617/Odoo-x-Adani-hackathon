import { useEffect, useState } from "react";
import { type MaintenanceRequest } from "@/types/maintenance";
import { maintenanceService } from "@/services/maintenance.service";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { ClipboardList, UserCheck } from "lucide-react";
import { formatDate } from "@/utils/date";
import { STAGE_COLORS } from "@/utils/constants";
import { toast } from "react-hot-toast";

export const TeamTasksPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.maintenanceTeamId) {
      // Safer check for maintenanceTeamId which might be populated or string or null
      let teamId: string | undefined;
      if (typeof user.maintenanceTeamId === 'string') {
          teamId = user.maintenanceTeamId;
      } else if (user.maintenanceTeamId && typeof user.maintenanceTeamId === 'object') {
          teamId = (user.maintenanceTeamId as any)._id || (user.maintenanceTeamId as any).id;
      }
      
      if (teamId) {
           fetchTeamRequests(teamId);
      } else {
        setLoading(false);
      }
    } else {
       setLoading(false);
    }
  }, [user]);

  const fetchTeamRequests = async (teamId: string) => {
    try {
      setLoading(true);
      const data = await maintenanceService.getByTeam(teamId);
      // Filter out tasks that are already assigned to SOMEONE ELSE?
      // Or show all tasks for the team? Usually "Team Tasks" implies shared responsibility.
      // Let's show all. But highlights ones unassigned.
      setRequests(data);
    } catch (error) {
      toast.error("Failed to fetch team tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimTask = async (requestId: string) => {
      if (!user) return;
      try {
          await maintenanceService.update(requestId, { assignedTo: user.id });
          toast.success("Task assigned to you");
          // Refresh
          let teamId: string | undefined;
          if (typeof user.maintenanceTeamId === 'string') {
              teamId = user.maintenanceTeamId;
          } else if (user.maintenanceTeamId && typeof user.maintenanceTeamId === 'object') {
              teamId = (user.maintenanceTeamId as any)._id || (user.maintenanceTeamId as any).id;
          }
          
          if (teamId) fetchTeamRequests(teamId);
      } catch (error) {
          toast.error("Failed to claim task");
      }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user?.maintenanceTeamId) {
       return (
        <EmptyState
          icon={ClipboardList}
          title="No Team Assigned"
          description="You are not part of any maintenance team."
        />
       );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Tasks</h1>
        <p className="text-muted-foreground">Manage tasks assigned to your maintenance team</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No team tasks"
          description="Your team has no active maintenance requests."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request._id} className="hover:shadow-md transition-shadow border-l-4" style={{borderLeftColor: request.assignedTo ? 'transparent' : '#eab308'}}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{request.subject}</h3>
                        {!request.assignedTo && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">Unassigned</Badge>
                        )}
                        {request.assignedTo && (
                            <Badge variant="outline" className="text-muted-foreground">
                                Assigned to: {request.assignedTo.name}
                            </Badge>
                        )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Equipment: {request.equipmentId?.name || "Unknown"}
                    </p>
                    {request.scheduledDate && (
                      <p className="text-sm text-muted-foreground">
                        Scheduled: {formatDate(request.scheduledDate)}
                      </p>
                    )}
                    {request.description && (
                      <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant="outline" className={STAGE_COLORS[request.status] || "bg-gray-100"}>
                      {request.status}
                    </Badge>
                    <Badge variant="secondary">{request.requestType}</Badge>
                    
                    {!request.assignedTo && (
                        <Button size="sm" onClick={() => handleClaimTask(request._id)}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Claim Task
                        </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
