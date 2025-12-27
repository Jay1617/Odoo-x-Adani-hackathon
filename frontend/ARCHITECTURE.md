# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    React Application                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    App.tsx                                │  │
│  │  - BrowserRouter                                          │  │
│  │  - Toaster (notifications)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 AppProvider.tsx                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │ AuthContext  │  │  UIContext    │  │ Maintenance   │ │  │
│  │  │              │  │               │  │  Context      │ │  │
│  │  │ - user       │  │ - sidebarOpen │  │ - requests[]   │ │  │
│  │  │ - token      │  │ - toggle()    │  │ - fetch()      │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  AppRoutes.tsx                            │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │            ProtectedRoute                          │   │  │
│  │  │  ┌──────────────────────────────────────────────┐ │   │  │
│  │  │  │            RoleGuard                         │ │   │  │
│  │  │  │  ┌────────────────────────────────────────┐ │ │   │  │
│  │  │  │  │      Layout Component                  │ │ │   │  │
│  │  │  │  │  ┌──────────────────────────────────┐ │ │ │   │  │
│  │  │  │  │  │    PageWrapper                   │ │ │ │   │  │
│  │  │  │  │  │  ├── Sidebar                     │ │ │ │   │  │
│  │  │  │  │  │  ├── Header                      │ │ │ │   │  │
│  │  │  │  │  │  └── Page Component              │ │ │ │   │  │
│  │  │  │  │  └──────────────────────────────────┘ │ │ │   │  │
│  │  │  │  └────────────────────────────────────────┘ │ │   │  │
│  │  │  └──────────────────────────────────────────────┘ │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Component Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Kanban     │  │   Calendar   │  │   Forms      │        │
│  │   Board      │  │   View       │  │   & Dialogs  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   UI         │  │   Common     │  │   Layout     │        │
│  │   Components │  │   Components │  │   Components │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   auth       │  │  equipment   │  │ maintenance  │        │
│  │   service    │  │  service     │  │  service      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │   team       │  │  company     │                           │
│  │   service    │  │  service     │                           │
│  └──────────────┘  └──────────────┘                           │
│                              │                                 │
│                              ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    api.ts                                 │  │
│  │  - Axios instance                                         │  │
│  │  - Request interceptor (adds token)                       │  │
│  │  - Response interceptor (handles 401)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API                                   │
│              (Odoo/External API)                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Authentication Flow
```
User Input (Login)
    │
    ▼
[Login Component] ──→ [authService.login()] ──→ [API Request]
    │                                                │
    │                                                ▼
    │                                          [Backend API]
    │                                                │
    │                                                ▼
    └─── [AuthContext.login()] ←── [Response {user, token}]
              │
              ▼
    [localStorage] + [State Update]
              │
              ▼
    [Navigate to Dashboard]
```

### Request Creation Flow
```
[Form Component]
    │
    │ User fills form
    ▼
[Submit Handler]
    │
    │ maintenanceService.create(data)
    ▼
[API Request] ──→ [Backend API]
    │
    │ Response
    ▼
[Update State] or [Refresh Data]
    │
    ▼
[UI Re-renders]
```

### Kanban Drag & Drop Flow
```
[User Drags Card]
    │
    ▼
[DragDropContext.onDragEnd]
    │
    │ Extract: draggableId, destination.droppableId
    ▼
[maintenanceService.updateStage(id, newStage)]
    │
    │ API Request
    ▼
[Backend Updates]
    │
    │ Success Response
    ▼
[onUpdate() Callback]
    │
    ▼
[Refresh Requests Data]
    │
    ▼
[UI Updates with New Stage]
```

## Component Dependency Tree

```
App
├── AppProvider
│   ├── AuthProvider
│   ├── UIProvider
│   └── MaintenanceProvider
│
└── BrowserRouter
    └── AppRoutes
        ├── Login (public)
        │
        └── ProtectedRoute
            └── RoleGuard
                └── Layout
                    └── PageWrapper
                        ├── Sidebar
                        │   └── Navigation Links
                        ├── Header
                        │   └── Logout Button
                        └── Page Component
                            ├── Feature Components
                            │   ├── KanbanBoard
                            │   │   ├── KanbanColumn
                            │   │   │   └── KanbanCard
                            │   │   └── KanbanColumn
                            │   │       └── KanbanCard
                            │   │
                            │   ├── MaintenanceCalendar
                            │   │   └── FullCalendar
                            │   │
                            │   └── Forms/Dialogs
                            │
                            └── UI Components
                                ├── Card
                                ├── Button
                                ├── Input
                                ├── Badge
                                └── ...
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Global State                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ AuthContext                                          │ │
│  │ - user: User | null                                  │ │
│  │ - token: string | null                               │ │
│  │ - login(data)                                        │ │
│  │ - logout()                                           │ │
│  │                                                       │ │
│  │ Persisted in: localStorage                           │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ UIContext                                            │ │
│  │ - sidebarOpen: boolean                               │ │
│  │ - toggleSidebar()                                    │ │
│  │                                                       │ │
│  │ Not persisted (session only)                          │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ MaintenanceContext (Optional)                        │ │
│  │ - requests: MaintenanceRequest[]                     │ │
│  │ - loading: boolean                                   │ │
│  │ - fetchRequests()                                    │ │
│  │ - updateRequest()                                    │ │
│  │                                                       │ │
│  │ Not persisted (fetched on demand)                    │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    Local State                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Component useState                                   │ │
│  │ - data: Type[]                                       │ │
│  │ - loading: boolean                                   │ │
│  │ - formData: FormData                                 │ │
│  │ - dialogOpen: boolean                                │ │
│  │                                                       │ │
│  │ Component-specific, not shared                       │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Routing Flow

```
User Navigates to URL
        │
        ▼
┌───────────────────┐
│  AppRoutes.tsx    │
│  Checks Route    │
└───────────────────┘
        │
        ├─── /login ──→ [Login Page] (public)
        │
        ├─── /dashboard ──→ [NavigateToRoleDashboard]
        │                    │
        │                    ├── main_admin ──→ /main-admin/dashboard
        │                    ├── company_admin ──→ /company-admin/dashboard
        │                    └── employee ──→ /employee/dashboard
        │
        └─── /[role]/* ──→ [ProtectedRoute]
                              │
                              ├── Not authenticated? ──→ /login
                              │
                              └── Authenticated ──→ [RoleGuard]
                                                      │
                                                      ├── Wrong role? ──→ /dashboard
                                                      │
                                                      └── Correct role ──→ [Layout]
                                                                           │
                                                                           └── [Page Component]
```

## Service Layer Architecture

```
Component
    │
    │ Calls service method
    ▼
Service File (e.g., equipment.service.ts)
    │
    │ Uses api instance
    ▼
api.ts (Axios instance)
    │
    │ Request Interceptor: Adds token
    │
    │ HTTP Request
    ▼
Backend API
    │
    │ Response
    ▼
api.ts
    │
    │ Response Interceptor: Handles 401
    │
    │ Typed Response
    ▼
Service Method
    │
    │ Returns typed data
    ▼
Component
    │
    │ Updates state
    ▼
UI Re-renders
```

## File Import Patterns

### Absolute Imports (using @ alias)
```tsx
// Types
import type { User } from "@/types/user";
import type { Equipment } from "@/types/equipment";

// Services
import { equipmentService } from "@/services/equipment.service";
import { maintenanceService } from "@/services/maintenance.service";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Utils
import { formatDate } from "@/utils/date";
import { STAGE_LABELS } from "@/utils/constants";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

// Context
import { useAuth } from "@/context/AuthContext";
```

## Key Design Patterns

### 1. Service Layer Pattern
- **Separation**: Business logic in services, not components
- **Reusability**: Services can be used by multiple components
- **Testability**: Easy to mock services for testing

### 2. Context Pattern
- **Global State**: Auth, UI state in Context
- **Avoid Prop Drilling**: No need to pass props through many levels
- **Performance**: Only components using context re-render

### 3. Component Composition
- **Small Components**: Each component has single responsibility
- **Composition**: Build complex UIs from simple components
- **Reusability**: Components can be used in multiple places

### 4. Type Safety
- **TypeScript**: All data structures typed
- **Compile-time Checks**: Catch errors before runtime
- **IntelliSense**: Better IDE support

### 5. Protected Routes
- **Authentication**: Check if user is logged in
- **Authorization**: Check if user has correct role
- **Redirects**: Automatic redirects for unauthorized access

## Performance Considerations

### 1. Code Splitting
- Routes are lazy-loaded (can be improved with React.lazy)
- Components loaded on demand

### 2. State Management
- Local state for component-specific data
- Context only for truly global state
- Avoid unnecessary re-renders

### 3. API Calls
- Debounced search inputs
- Fetch on mount, not on every render
- Cache responses when appropriate

### 4. Rendering
- Conditional rendering for loading/empty states
- Memoization for expensive computations (future)
- Virtual scrolling for long lists (future)

## Security Considerations

### 1. Authentication
- Token stored in localStorage
- Token added to all API requests automatically
- 401 responses trigger logout

### 2. Authorization
- Role-based route protection
- Permission checks in components
- Backend should validate all requests

### 3. Input Validation
- TypeScript types prevent invalid data
- Form validation (to be implemented)
- Sanitize user inputs

### 4. XSS Prevention
- React automatically escapes content
- No innerHTML usage
- Safe component rendering

## Testing Strategy (Future)

### Unit Tests
- Test utility functions
- Test service methods (mocked API)
- Test hooks

### Component Tests
- Test component rendering
- Test user interactions
- Test form submissions

### Integration Tests
- Test API integration
- Test routing
- Test authentication flow

### E2E Tests
- Test complete user workflows
- Test role-based access
- Test drag & drop functionality

