import { useEffect, useState } from "react";
import { type MaintenanceRequest } from "@/types/maintenance";
import { maintenanceService } from "@/services/maintenance.service";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import { toast } from "react-hot-toast";

import { useSearchParams } from "react-router-dom";

export const MaintenanceRequestsPage = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get("equipmentId");

  useEffect(() => {
    fetchRequests();
  }, [equipmentId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Pass params if any
      const params = equipmentId ? { equipmentId } : undefined;
      const data = await maintenanceService.getAll(params);
      setRequests(data);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    // Open request details dialog
    console.log("Open request:", request);
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            Maintenance Requests
          </h1>
          <p className="text-muted-foreground text-base">Track and manage all maintenance requests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <KanbanBoard requests={requests} onUpdate={fetchRequests} onCardClick={handleCardClick} />
    </div>
  );
};

