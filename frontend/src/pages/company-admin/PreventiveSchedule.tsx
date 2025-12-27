import { useEffect, useState } from "react";
import { MaintenanceRequest } from "@/types/maintenance";
import { maintenanceService } from "@/services/maintenance.service";
import { MaintenanceCalendar } from "@/components/calendar/MaintenanceCalendar";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export const PreventiveSchedulePage = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getPreventive();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to fetch preventive maintenance");
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    // Open create request dialog with date pre-filled
    console.log("Create request for date:", date);
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
        <div>
          <h1 className="text-3xl font-bold">Preventive Schedule</h1>
          <p className="text-muted-foreground">Schedule and view preventive maintenance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      <MaintenanceCalendar
        requests={requests}
        onDateClick={handleDateClick}
        onEventClick={(request) => console.log("Event clicked:", request)}
      />
    </div>
  );
};

