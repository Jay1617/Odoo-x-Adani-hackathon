import { Draggable } from "@hello-pangea/dnd";
import { type MaintenanceRequest } from "@/types/maintenance";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, isOverdue } from "@/utils/date";
import { STAGE_LABELS, STAGE_COLORS, TYPE_LABELS } from "@/utils/constants";
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  request: MaintenanceRequest;
  index: number;
  onClick?: () => void;
}

export const KanbanCard = ({ request, index, onClick }: KanbanCardProps) => {
    // Assuming scheduledDate is used for overdue check
  const overdue = request.scheduledDate && isOverdue(request.scheduledDate) && request.status !== "REPAIRED" && request.status !== "SCRAP";
  
  const id = request._id;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-3 cursor-pointer hover:shadow-md transition-shadow mb-3 bg-card border-l-4",
            // Dynamic border color based on priority or overdue
            overdue ? "border-l-red-500" : "border-l-primary",
            snapshot.isDragging && "shadow-lg rotate-2"
          )}
          onClick={onClick}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate" title={request.subject}>{request.subject}</h4>
                <p className="text-xs text-muted-foreground truncate" title={request.equipmentId?.name}>
                  {request.equipmentId?.name}
                </p>
              </div>
              {overdue && (
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Badge variant="outline" className={cn("text-[10px] px-1 py-0 h-5", STAGE_COLORS[request.status])}>
                {STAGE_LABELS[request.status]}
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">
                {TYPE_LABELS[request.requestType]}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                 {request.scheduledDate && (
                  <div className="flex items-center text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(request.scheduledDate)}
                  </div>
                )}
                
                {request.assignedTo ? (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Avatar className="h-5 w-5">
                      {/* <AvatarImage src={request.assignedTo.avatar} /> */}
                      <AvatarFallback className="text-[9px]">
                        {request.assignedTo.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                    <div className="text-[10px] text-muted-foreground italic ml-auto">Unassigned</div>
                )}
            </div>
          </div>
        </Card>
      )}
    </Draggable>
  );
};
