import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { type MaintenanceRequest, type MaintenanceRequestStatus } from "@/types/maintenance";
import { MAINTENANCE_STAGES } from "@/utils/constants";
import { maintenanceService } from "@/services/maintenance.service";
import { toast } from "react-hot-toast";

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onUpdate: () => void;
  onCardClick?: (request: MaintenanceRequest) => void;
}

export const KanbanBoard = ({ requests, onUpdate, onCardClick }: KanbanBoardProps) => {
  const stages: MaintenanceRequestStatus[] = [
    MAINTENANCE_STAGES.NEW,
    MAINTENANCE_STAGES.IN_PROGRESS,
    MAINTENANCE_STAGES.REPAIRED,
    MAINTENANCE_STAGES.SCRAP,
  ];

  const requestsByStage = stages.reduce((acc, stage) => {
    acc[stage] = requests.filter((r) => r.status === stage);
    return acc;
  }, {} as Record<MaintenanceRequestStatus, MaintenanceRequest[]>);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as MaintenanceRequestStatus;

    // Find request by string ID
    const request = requests.find((r) => r._id === draggableId);
    
    // Check if status is same
    if (!request || request.status === newStatus) return;

    try {
        const idToUpdate = request._id;
        // Optimistic update could happen here but let's just wait for API
      await maintenanceService.updateStatus(idToUpdate, newStatus);
      toast.success("Request updated successfully");
      onUpdate();

      // If moved to scrap, mark equipment as scrapped
      if (newStatus === MAINTENANCE_STAGES.SCRAP) {
        toast("Equipment marked as scrapped", { icon: "ℹ️" });
      }
    } catch (error) {
      toast.error("Failed to update request");
      console.error(error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            requests={requestsByStage[stage] || []}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
