import { useEffect, useState } from "react";
import { type MaintenanceTeam } from "@/types/team";
import { teamService } from "@/services/team.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Users } from "lucide-react";
import { toast } from "react-hot-toast";

export const TeamsPage = () => {
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAll();
      setTeams(data);
    } catch (error) {
      toast.error("Failed to fetch teams");
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
        <div>
          <h1 className="text-3xl font-bold">Maintenance Teams</h1>
          <p className="text-muted-foreground">Manage maintenance teams and members</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams found"
          description="Get started by creating your first maintenance team"
          action={{ label: "Add Team", onClick: () => {} }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {team.description && (
                  <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Members ({team.members.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

