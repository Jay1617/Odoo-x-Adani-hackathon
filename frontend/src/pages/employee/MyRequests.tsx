import { useEffect, useState } from "react";
import { type MaintenanceRequest } from "@/types/maintenance";
import { maintenanceService } from "@/services/maintenance.service";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { FileText } from "lucide-react";
import { formatDate } from "@/utils/date";
import { STAGE_LABELS, STAGE_COLORS, TYPE_LABELS } from "@/utils/constants";
import { toast } from "react-hot-toast";

export const MyRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await maintenanceService.getAll();
      const myRequests = allRequests.filter((r) => r.assignedToId === user?.id);
      setRequests(myRequests);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold">My Requests</h1>
        <p className="text-muted-foreground">Requests assigned to you</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No requests assigned"
          description="You don't have any maintenance requests assigned to you yet"
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{request.subject}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Equipment: {request.equipmentName}
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
                    <Badge variant="outline" className={STAGE_COLORS[request.stage]}>
                      {STAGE_LABELS[request.stage]}
                    </Badge>
                    <Badge variant="secondary">{TYPE_LABELS[request.type]}</Badge>
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

