import { useEffect, useState } from "react";
import { type Equipment } from "@/types/equipment";
import { equipmentService } from "@/services/equipment.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Wrench, Search } from "lucide-react";
import { formatDate } from "@/utils/date";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import { AddEquipmentDialog } from "@/components/equipment/AddEquipmentDialog";

export const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = equipment.filter(
        (eq) =>
          eq.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          eq.serialNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          eq.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredEquipment(filtered);
    } else {
      setFilteredEquipment(equipment);
    }
  }, [debouncedSearch, equipment]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAll();
      setEquipment(data);
      setFilteredEquipment(data);
    } catch (error) {
      toast.error("Failed to fetch equipment");
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="h-8 w-8 text-primary" />
            Equipment
          </h1>
          <p className="text-muted-foreground text-base">Manage all company assets</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>
      
      <AddEquipmentDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onEquipmentCreated={fetchEquipment}
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, serial number, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredEquipment.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No equipment found"
          description={searchTerm ? "Try adjusting your search" : "Get started by adding your first equipment"}
          action={{ label: "Add Equipment", onClick: () => setIsAddDialogOpen(true) }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <Card key={eq.id} className="hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{eq.name}</CardTitle>
                  <Badge variant={eq.status === "ACTIVE" ? "default" : "secondary"} className="font-semibold">
                    {eq.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground"><span className="font-medium">Serial:</span> {eq.serialNumber}</p>
                    <p className="text-muted-foreground"><span className="font-medium">Location:</span> {eq.location}</p>
                    {eq.department && (
                      <p className="text-muted-foreground"><span className="font-medium">Department:</span> {eq.department}</p>
                    )}
                    {eq.assignedTo && (
                      <p className="text-muted-foreground"><span className="font-medium">Assigned to:</span> {eq.assignedTo.name}</p>
                    )}
                    {eq.maintenanceTeamId?.name && (
                      <p className="text-muted-foreground"><span className="font-medium">Team:</span> {eq.maintenanceTeamId.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">
                      Purchased: {formatDate(eq.purchaseDate)}
                    </p>
                  </div>
                  <Link to={`/company-admin/equipment/${eq.id || eq._id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

