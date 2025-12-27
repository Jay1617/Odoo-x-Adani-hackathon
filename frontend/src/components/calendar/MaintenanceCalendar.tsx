import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type MaintenanceRequest } from "@/types/maintenance";
import { formatDate } from "@/utils/date";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TYPE_LABELS, STAGE_LABELS, STAGE_COLORS } from "@/utils/constants";
import { cn } from "@/lib/utils";

interface MaintenanceCalendarProps {
  requests: MaintenanceRequest[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (request: MaintenanceRequest) => void;
}

export const MaintenanceCalendar = ({
  requests,
  onDateClick,
  onEventClick,
}: MaintenanceCalendarProps) => {
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  // Filter only preventive maintenance requests as per requirements
  const safeRequests = requests || [];
  const preventiveRequests = safeRequests.filter((r) => r.requestType === "PREVENTIVE");

  const events = preventiveRequests.map((request) => ({
    id: request._id,
    title: `${request.subject} (${request.equipmentId?.name})`,
    start: request.scheduledDate || request.createdAt,
    extendedProps: { request },
    backgroundColor: request.status === "REPAIRED" ? "oklch(0.646 0.222 41.116)" : "oklch(0.205 0 0)", // Custom colors
    borderColor: "transparent",
    textColor: "#fff"
  }));

  const handleDateClick = (arg: { date: Date }) => {
    onDateClick?.(arg.date);
  };

  const handleEventClick = (arg: any) => {
    const request = arg.event.extendedProps.request as MaintenanceRequest;
    setSelectedRequest(request);
    onEventClick?.(request);
  };

  return (
    <>
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          height="auto"
          dayMaxEvents={true}
        />
      </div>

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRequest.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Equipment</p>
                    <p className="text-sm">{selectedRequest.equipmentId?.name}</p>
                 </div>
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                    <p className="text-sm">{selectedRequest.equipmentId?.serialNumber}</p>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 <Badge variant="outline" className={cn(STAGE_COLORS[selectedRequest.status])}>
                    {STAGE_LABELS[selectedRequest.status]}
                 </Badge>
                 <Badge variant="secondary">{TYPE_LABELS[selectedRequest.requestType]}</Badge>
              </div>

              {selectedRequest.scheduledDate && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Date</p>
                  <p className="text-sm">
                    {formatDate(selectedRequest.scheduledDate)}
                  </p>
                </div>
              )}
              {selectedRequest.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm p-2 bg-muted rounded-md">{selectedRequest.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
