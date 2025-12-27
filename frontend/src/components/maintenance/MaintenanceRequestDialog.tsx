import { useState, useEffect } from "react";
import { type MaintenanceRequestFormData } from "@/types/maintenance";
import { type Equipment } from "@/types/equipment";
import { maintenanceService } from "@/services/maintenance.service";
import { equipmentService } from "@/services/equipment.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";  
import { Loader } from "@/components/common/Loader";
import { toast } from "react-hot-toast";

interface MaintenanceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated: () => void;
  equipmentId?: string; // Optional: pre-select equipment
}

export const MaintenanceRequestDialog = ({
  open,
  onOpenChange,
  onRequestCreated,
  equipmentId
}: MaintenanceRequestDialogProps) => {
  const [formData, setFormData] = useState<MaintenanceRequestFormData>({
    subject: "",
    requestType: "CORRECTIVE",
    equipmentId: equipmentId || "",
    description: "",
    priority: "MEDIUM",
  });
  
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEquipments, setFetchingEquipments] = useState(false);

  useEffect(() => {
    if (open) {
        fetchEquipments();
        if (equipmentId) {
            setFormData(prev => ({ ...prev, equipmentId }));
        }
    }
  }, [open, equipmentId]);

  const fetchEquipments = async () => {
    try {
        setFetchingEquipments(true);
        const data = await equipmentService.getAll();
        setEquipments(data);
    } catch (error) {
        console.error("Failed to fetch equipments");
    } finally {
        setFetchingEquipments(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await maintenanceService.create(formData);
      toast.success("Maintenance request created successfully");
      onOpenChange(false);
      onRequestCreated();
      // Reset form
      setFormData({
        subject: "",
        requestType: "CORRECTIVE",
        equipmentId: equipmentId || "",
        description: "",
        priority: "MEDIUM",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Maintenance Request</DialogTitle>
          <DialogDescription>Submit a new request for equipment maintenance.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g. Conveyor belt noise"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment</Label>
            <select
                id="equipment"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.equipmentId}
                onChange={(e) => setFormData({...formData, equipmentId: e.target.value})}
                required
                disabled={!!equipmentId || fetchingEquipments} 
             >
                <option value="" disabled>{fetchingEquipments ? "Loading..." : "Select Equipment"}</option>
                {equipments.map((eq) => (
                    <option key={eq._id} value={eq._id}>
                        {eq.name} ({eq.serialNumber})
                    </option>
                ))}
             </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Request Type</Label>
             <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.requestType}
                onChange={(e) => setFormData({...formData, requestType: e.target.value as any})}
                required
             >
                <option value="CORRECTIVE">Corrective (Breakdown)</option>
                <option value="PREVENTIVE">Preventive (Routine)</option>
             </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
                id="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                required
             >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
             </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader /> : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
