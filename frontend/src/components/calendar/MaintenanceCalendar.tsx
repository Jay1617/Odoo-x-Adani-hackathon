import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { type MaintenanceRequest } from "@/types/maintenance";
import { formatDate } from "@/utils/date";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TYPE_LABELS } from "@/utils/constants";

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

  // Filter only preventive maintenance requests
  const preventiveRequests = requests.filter((r) => r.type === "preventive");

  const events = preventiveRequests.map((request) => ({
    id: request.id.toString(),
    title: request.subject,
    start: request.scheduledDate || request.createdAt,
    extendedProps: { request },
    backgroundColor: request.stage === "repaired" ? "#10b981" : "#3b82f6",
  }));

  const handleDateClick = (arg: { date: Date }) => {
    onDateClick?.(arg.date);
  };

  const handleEventClick = (arg: { event: { extendedProps: { request: MaintenanceRequest } } }) => {
    const request = arg.event.extendedProps.request;
    setSelectedRequest(request);
    onEventClick?.(request);
  };

  return (
    <>
      <div className="bg-card rounded-lg border p-4">
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
        />
      </div>

      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRequest.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Equipment</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.equipmentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Type</p>
                <Badge variant="secondary">{TYPE_LABELS[selectedRequest.type]}</Badge>
              </div>
              {selectedRequest.scheduledDate && (
                <div>
                  <p className="text-sm font-medium">Scheduled Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedRequest.scheduledDate)}
                  </p>
                </div>
              )}
              {selectedRequest.description && (
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

