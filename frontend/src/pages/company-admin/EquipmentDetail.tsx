import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { type Equipment } from "@/types/equipment";
import { equipmentService } from "@/services/equipment.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";
import { ArrowLeft, Wrench, Calendar, MapPin, User, FileText } from "lucide-react";
import { formatDate } from "@/utils/date";
import { toast } from "react-hot-toast";

export const EquipmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEquipment(id);
    }
  }, [id]);

  const fetchEquipment = async (equipmentId: string) => {
    try {
      setLoading(true);
      const data = await equipmentService.getById(equipmentId);
      setEquipment(data);
    } catch (error) {
      toast.error("Failed to fetch equipment details");
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

  if (!equipment) {
    return <div>Equipment not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/company-admin/equipment">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{equipment.name}</h1>
          <p className="text-muted-foreground">{equipment.serialNumber}</p>
        </div>
        <div className="ml-auto flex gap-2">
            {/* Smart Button */}
            <Link to={`/company-admin/maintenance-requests?equipmentId=${equipment._id || equipment.id}`}>
                <Button variant="outline" className="h-10 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Wrench className="h-4 w-4 mr-2" />
                    Maintenance
                    <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                        {equipment.openRequestCount || 0}
                    </Badge>
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
                <Badge variant={equipment.status === "ACTIVE" ? "default" : "secondary"}>
                    {equipment.status}
                </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1" /> Location
                    </span>
                    <p>{equipment.location}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                        <User className="h-3 w-3 mr-1" /> Assigned To
                    </span>
                    <p>{equipment.assignedTo?.name || "Unassigned"}</p>
                </div>
                <div>
                     <span className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                        <Wrench className="h-3 w-3 mr-1" /> Team
                    </span>
                    <p>{equipment.maintenanceTeamId?.name || "No Team"}</p>
                </div>
                <div>
                     <span className="text-sm font-medium text-muted-foreground flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" /> Purchase Date
                    </span>
                    <p>{formatDate(equipment.purchaseDate)}</p>
                </div>
            </div>
          </CardContent>
        </Card>

        {equipment.notes && (
             <Card>
             <CardHeader>
               <CardTitle>Notes</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-start gap-2">
                   <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                   <p className="whitespace-pre-wrap">{equipment.notes}</p>
               </div>
             </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
};
