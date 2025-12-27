import { useEffect, useState } from "react";
import { MaintenanceRequest } from "@/types/maintenance";
import { maintenanceService } from "@/services/maintenance.service";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Loader } from "@/components/common/Loader";
import { toast } from "react-hot-toast";

export const EmployeeKanbanPage = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAll();
      setRequests(data);
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
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Drag and drop to update request status</p>
      </div>

      <KanbanBoard requests={requests} onUpdate={fetchRequests} />
    </div>
  );
};

