import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { type MaintenanceRequest, type MaintenanceRequestStage } from "@/types/maintenance";
import { MAINTENANCE_STAGES } from "@/utils/constants";
import { maintenanceService } from "@/services/maintenance.service";
import { toast } from "react-hot-toast";

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onUpdate: () => void;
  onCardClick?: (request: MaintenanceRequest) => void;
}

export const KanbanBoard = ({ requests, onUpdate, onCardClick }: KanbanBoardProps) => {
  const stages: MaintenanceRequestStage[] = [
    MAINTENANCE_STAGES.NEW,
    MAINTENANCE_STAGES.IN_PROGRESS,
    MAINTENANCE_STAGES.REPAIRED,
    MAINTENANCE_STAGES.SCRAP,
  ];

  const requestsByStage = stages.reduce((acc, stage) => {
    acc[stage] = requests.filter((r) => r.stage === stage);
    return acc;
  }, {} as Record<MaintenanceRequestStage, MaintenanceRequest[]>);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const requestId = parseInt(draggableId);
    const newStage = destination.droppableId as MaintenanceRequestStage;

    const request = requests.find((r) => r.id === requestId);
    if (!request || request.stage === newStage) return;

    try {
      await maintenanceService.updateStage(requestId, newStage);
      toast.success("Request updated successfully");
      onUpdate();

      // If moved to scrap, mark equipment as scrapped
      if (newStage === MAINTENANCE_STAGES.SCRAP) {
        toast.info("Equipment marked as scrapped");
      }
    } catch (error) {
      toast.error("Failed to update request");
      console.error(error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
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

