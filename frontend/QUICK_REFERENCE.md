# Quick Reference Guide

## File Locations

### Where to Find Things

| What You Need | File Location |
|--------------|---------------|
| User types | `src/types/user.ts` |
| Equipment types | `src/types/equipment.ts` |
| Maintenance types | `src/types/maintenance.ts` |
| API calls | `src/services/*.service.ts` |
| Auth state | `src/context/AuthContext.tsx` |
| UI components | `src/components/ui/` |
| Page components | `src/pages/[role]/` |
| Routes | `src/routes/AppRoutes.tsx` |
| Constants | `src/utils/constants.ts` |
| Date utils | `src/utils/date.ts` |

## Common Code Snippets

### Fetching Data
```tsx
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetch = async () => {
    try {
      const result = await service.getAll();
      setData(result);
    } catch (error) {
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);
```

### Using Auth
```tsx
import { useAuth } from "@/hooks/useAuth";

const { user, token, login, logout } = useAuth();
```

### Using Role
```tsx
import { useRole, useHasRole } from "@/hooks/useRole";

const role = useRole(); // "main_admin" | "company_admin" | "employee"
const isAdmin = useHasRole(["main_admin", "company_admin"]);
```

### Creating a Form
```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const [formData, setFormData] = useState({ name: "", email: "" });

<form onSubmit={handleSubmit}>
  <Label htmlFor="name">Name</Label>
  <Input
    id="name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
  <Button type="submit">Submit</Button>
</form>
```

### Showing Loading State
```tsx
import { Loader } from "@/components/common/Loader";

if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader size="lg" />
    </div>
  );
}
```

### Showing Empty State
```tsx
import { EmptyState } from "@/components/common/EmptyState";

if (data.length === 0) {
  return (
    <EmptyState
      icon={Icon}
      title="No items found"
      description="Get started by adding your first item"
      action={{ label: "Add Item", onClick: handleAdd }}
    />
  );
}
```

### Toast Notifications
```tsx
import { toast } from "react-hot-toast";

toast.success("Success message");
toast.error("Error message");
toast.info("Info message");
```

### Navigation
```tsx
import { useNavigate, Link } from "react-router-dom";

// Programmatic
const navigate = useNavigate();
navigate("/dashboard");

// Link component
<Link to="/dashboard">Dashboard</Link>
```

### Date Formatting
```tsx
import { formatDate, isOverdue } from "@/utils/date";

formatDate("2024-01-15"); // "Jan 15, 2024"
isOverdue("2024-01-01"); // true if past
```

### Badge with Stage Color
```tsx
import { Badge } from "@/components/ui/badge";
import { STAGE_COLORS, STAGE_LABELS } from "@/utils/constants";

<Badge variant="outline" className={STAGE_COLORS[request.stage]}>
  {STAGE_LABELS[request.stage]}
</Badge>
```

## Service Method Patterns

### GET Request
```tsx
getAll: async (): Promise<Type[]> => {
  const response = await api.get<Type[]>("/endpoint");
  return response.data;
}
```

### POST Request
```tsx
create: async (data: FormData): Promise<Type> => {
  const response = await api.post<Type>("/endpoint", data);
  return response.data;
}
```

### PUT Request
```tsx
update: async (id: number, data: Partial<Type>): Promise<Type> => {
  const response = await api.put<Type>(`/endpoint/${id}`, data);
  return response.data;
}
```

### DELETE Request
```tsx
delete: async (id: number): Promise<void> => {
  await api.delete(`/endpoint/${id}`);
}
```

## Component Patterns

### Protected Component
```tsx
import { ProtectedRoute } from "@/routes/ProtectedRoute";

<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### Role-Guarded Component
```tsx
import { RoleGuard } from "@/routes/RoleGuard";

<RoleGuard allowedRoles={["main_admin", "company_admin"]}>
  <AdminOnlyComponent />
</RoleGuard>
```

### Dialog/Modal
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## Type Definitions Quick Look

### User
```tsx
type Role = "main_admin" | "company_admin" | "employee";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  companyId?: number;
  avatar?: string;
}
```

### Equipment
```tsx
interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
  department?: string;
  employeeId?: number;
  employeeName?: string;
  maintenanceTeamId: number;
  maintenanceTeamName: string;
  technicianId?: number;
  technicianName?: string;
  category?: string;
  status: "active" | "inactive" | "scrapped";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Maintenance Request
```tsx
type MaintenanceRequestStage = "new" | "in_progress" | "repaired" | "scrap";
type MaintenanceRequestType = "corrective" | "preventive";

interface MaintenanceRequest {
  id: number;
  subject: string;
  type: MaintenanceRequestType;
  stage: MaintenanceRequestStage;
  equipmentId: number;
  equipmentName: string;
  scheduledDate?: string;
  duration?: number;
  assignedToId?: number;
  assignedToName?: string;
  maintenanceTeamId: number;
  maintenanceTeamName: string;
  description?: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Route Paths

| Role | Base Path | Available Routes |
|------|-----------|------------------|
| Main Admin | `/main-admin` | `/dashboard`, `/companies` |
| Company Admin | `/company-admin` | `/dashboard`, `/equipment`, `/teams`, `/maintenance-requests`, `/preventive-schedule`, `/reports` |
| Employee | `/employee` | `/dashboard`, `/my-requests`, `/kanban` |

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8069/api
```

## Common Imports

```tsx
// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useDebounce } from "@/hooks/useDebounce";

// Services
import { equipmentService } from "@/services/equipment.service";
import { maintenanceService } from "@/services/maintenance.service";

// Utils
import { formatDate, isOverdue } from "@/utils/date";
import { STAGE_LABELS, STAGE_COLORS } from "@/utils/constants";
import { canManageEquipment } from "@/utils/permissions";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";

// Router
import { useNavigate, Link } from "react-router-dom";

// Notifications
import { toast } from "react-hot-toast";
```

## Troubleshooting

### "Cannot find module '@/...'"
- Check `tsconfig.json` has `"@/*": ["./src/*"]` in paths
- Check `vite.config.ts` has alias configured
- Restart dev server

### "useAuth must be used within AuthProvider"
- Wrap component in `AppProvider` (already done in `main.tsx`)

### API calls failing
- Check `.env` file has `VITE_API_BASE_URL`
- Check backend is running
- Check CORS settings on backend

### Drag & drop not working
- Ensure `KanbanCard` is wrapped in `Draggable`
- Ensure `KanbanColumn` is wrapped in `Droppable`
- Ensure `KanbanBoard` is wrapped in `DragDropContext`

### Calendar not showing events
- Ensure events have `start` date
- Check events are filtered to `type === "preventive"`

