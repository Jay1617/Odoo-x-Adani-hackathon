import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";

// Auth
import { Login } from "@/pages/auth/Login";

// Main Admin
import { MainAdminLayout } from "@/layouts/MainAdminLayout";
import { MainAdminDashboard } from "@/pages/main-admin/Dashboard";
import { Companies } from "@/pages/main-admin/Companies";

// Company Admin
import { CompanyAdminLayout } from "@/layouts/CompanyAdminLayout";
import { CompanyAdminDashboard } from "@/pages/company-admin/Dashboard";
import { EquipmentPage } from "@/pages/company-admin/Equipment";
import { TeamsPage } from "@/pages/company-admin/Teams";
import { MaintenanceRequestsPage } from "@/pages/company-admin/MaintenanceRequests";
import { PreventiveSchedulePage } from "@/pages/company-admin/PreventiveSchedule";
import { ReportsPage } from "@/pages/company-admin/Reports";

// Employee
import { EmployeeLayout } from "@/layouts/EmployeeLayout";
import { EmployeeDashboard } from "@/pages/employee/Dashboard";
import { MyRequestsPage } from "@/pages/employee/MyRequests";
import { EmployeeKanbanPage } from "@/pages/employee/Kanban";
import { useAuth } from "@/hooks/useAuth";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Main Admin Routes */}
      <Route
        path="/main-admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["main_admin"]}>
              <MainAdminLayout>
                <Routes>
                  <Route path="dashboard" element={<MainAdminDashboard />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </MainAdminLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Company Admin Routes */}
      <Route
        path="/company-admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["company_admin"]}>
              <CompanyAdminLayout>
                <Routes>
                  <Route path="dashboard" element={<CompanyAdminDashboard />} />
                  <Route path="equipment" element={<EquipmentPage />} />
                  <Route path="teams" element={<TeamsPage />} />
                  <Route path="maintenance-requests" element={<MaintenanceRequestsPage />} />
                  <Route path="preventive-schedule" element={<PreventiveSchedulePage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </CompanyAdminLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={["employee"]}>
              <EmployeeLayout>
                <Routes>
                  <Route path="dashboard" element={<EmployeeDashboard />} />
                  <Route path="my-requests" element={<MyRequestsPage />} />
                  <Route path="kanban" element={<EmployeeKanbanPage />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </EmployeeLayout>
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Default redirect based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <NavigateToRoleDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const NavigateToRoleDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;

  const rolePath = {
    main_admin: "/main-admin/dashboard",
    company_admin: "/company-admin/dashboard",
    employee: "/employee/dashboard",
  };

  return <Navigate to={rolePath[user.role] || "/login"} replace />;
};

