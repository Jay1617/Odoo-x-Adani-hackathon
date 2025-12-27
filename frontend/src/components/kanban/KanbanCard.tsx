import { Draggable } from "@hello-pangea/dnd";
import { MaintenanceRequest } from "@/types/maintenance";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, isOverdue } from "@/utils/date";
import { STAGE_LABELS, STAGE_COLORS, TYPE_LABELS } from "@/utils/constants";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  request: MaintenanceRequest;
  index: number;
  onClick?: () => void;
}

export const KanbanCard = ({ request, index, onClick }: KanbanCardProps) => {
  const overdue = request.isOverdue || (request.scheduledDate && isOverdue(request.scheduledDate));

  return (
    <Draggable draggableId={request.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "p-4 cursor-pointer hover:shadow-md transition-shadow",
            overdue && "border-l-4 border-l-red-500",
            snapshot.isDragging && "shadow-lg"
          )}
          onClick={onClick}
        >
          <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{request.subject}</h4>
            <p className="text-xs text-muted-foreground">{request.equipmentName}</p>
          </div>
          {overdue && (
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 ml-2" />
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-xs", STAGE_COLORS[request.stage])}>
            {STAGE_LABELS[request.stage]}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {TYPE_LABELS[request.type]}
          </Badge>
        </div>

        {request.scheduledDate && (
          <p className="text-xs text-muted-foreground">
            Scheduled: {formatDate(request.scheduledDate)}
          </p>
        )}

        {request.assignedToId && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={request.assignedToAvatar} />
              <AvatarFallback>
                {request.assignedToName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{request.assignedToName}</span>
          </div>
        )}

            {request.duration && (
              <p className="text-xs text-muted-foreground">Duration: {request.duration}h</p>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );
};

