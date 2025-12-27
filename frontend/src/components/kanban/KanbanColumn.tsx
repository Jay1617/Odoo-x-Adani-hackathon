import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { type MaintenanceRequest } from "@/types/maintenance";
import { STAGE_LABELS, STAGE_COLORS } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  stage: MaintenanceRequest["stage"];
  requests: MaintenanceRequest[];
  onCardClick?: (request: MaintenanceRequest) => void;
}

export const KanbanColumn = ({ stage, requests, onCardClick }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col h-full min-w-[300px]">
      <div className={cn("p-3 rounded-t-lg font-semibold text-sm", STAGE_COLORS[stage])}>
        <div className="flex items-center justify-between">
          <span>{STAGE_LABELS[stage]}</span>
          <span className="text-xs font-normal">({requests.length})</span>
        </div>
      </div>

      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 space-y-3 rounded-b-lg bg-muted/30 transition-colors",
              snapshot.isDraggingOver && "bg-muted/50"
            )}
          >
            {requests.map((request, index) => (
              <KanbanCard
                key={request.id}
                request={request}
                index={index}
                onClick={() => onCardClick?.(request)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

