# GearGuard Frontend - Development Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [File-by-File Explanation](#file-by-file-explanation)
4. [Data Flow](#data-flow)
5. [Key Patterns & Conventions](#key-patterns--conventions)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Routing System](#routing-system)
9. [API Integration](#api-integration)
10. [Common Tasks](#common-tasks)

---

## Project Overview

**GearGuard** is a maintenance management system built with React + TypeScript. It manages equipment, maintenance teams, and maintenance requests with role-based access control.

**Tech Stack:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- shadcn/ui components
- React Router v7
- FullCalendar (calendar view)
- @hello-pangea/dnd (drag & drop)
- Axios (HTTP client)
- react-hot-toast (notifications)
- dayjs (date handling)

---

## Folder Structure

```
frontend/
├── public/                    # Static public assets
│   └── vite.svg              # Vite logo (can be replaced with GearGuard logo)
│
├── src/
│   ├── assets/               # Static assets (images, icons)
│   │   ├── icons/            # Icon files
│   │   └── images/           # Image files
│   │
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── common/           # Shared common components
│   │   ├── kanban/           # Kanban board components
│   │   ├── calendar/         # Calendar components
│   │   └── layout/           # Layout components (Sidebar, Header)
│   │
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── UIContext.tsx     # UI state (sidebar, theme)
│   │   ├── MaintenanceContext.tsx  # Maintenance requests state
│   │   └── index.ts          # Context exports
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Auth hook wrapper
│   │   ├── useRole.ts        # Role checking hooks
│   │   └── useDebounce.ts    # Debounce utility hook
│   │
│   ├── layouts/              # Role-based layout wrappers
│   │   ├── MainAdminLayout.tsx
│   │   ├── CompanyAdminLayout.tsx
│   │   └── EmployeeLayout.tsx
│   │
│   ├── pages/                # Route-level page components
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   ├── main-admin/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Companies.tsx
│   │   ├── company-admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Equipment.tsx
│   │   │   ├── Teams.tsx
│   │   │   ├── MaintenanceRequests.tsx
│   │   │   ├── PreventiveSchedule.tsx
│   │   │   └── Reports.tsx
│   │   └── employee/
│   │       ├── Dashboard.tsx
│   │       ├── MyRequests.tsx
│   │       └── Kanban.tsx
│   │
│   ├── routes/               # Routing configuration
│   │   ├── AppRoutes.tsx     # Main routing setup
│   │   ├── ProtectedRoute.tsx  # Auth protection
│   │   └── RoleGuard.tsx     # Role-based access control
│   │
│   ├── services/             # API service layer
│   │   ├── api.ts            # Axios instance & interceptors
│   │   ├── auth.service.ts   # Authentication API
│   │   ├── equipment.service.ts
│   │   ├── maintenance.service.ts
│   │   ├── team.service.ts
│   │   └── company.service.ts
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── user.ts
│   │   ├── company.ts
│   │   ├── equipment.ts
│   │   ├── maintenance.ts
│   │   └── team.ts
│   │
│   ├── utils/                # Utility functions
│   │   ├── date.ts           # Date formatting/validation
│   │   ├── constants.ts      # App constants
│   │   └── permissions.ts    # Permission helpers
│   │
│   ├── lib/                  # Library utilities
│   │   └── utils.ts          # cn() helper (Tailwind class merger)
│   │
│   ├── App.tsx               # Main app component (routing)
│   ├── AppProvider.tsx       # Context providers wrapper
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles (Tailwind)
│
├── .env                      # Environment variables (create this)
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── tailwind.config.ts        # Tailwind config (if needed)
├── package.json              # Dependencies
└── README.md                 # Project documentation
```

---

## File-by-File Explanation

### Entry Points

#### `src/main.tsx`
- **Purpose**: Application entry point
- **What it does**: 
  - Renders React app to DOM
  - Wraps app in `AppProvider` for context
  - Imports global CSS
- **Key Code**:
  ```tsx
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
  ```

#### `src/App.tsx`
- **Purpose**: Main app component with routing
- **What it does**:
  - Sets up `BrowserRouter` for React Router
  - Renders `AppRoutes` component
  - Adds `Toaster` for notifications
- **Key Code**:
  ```tsx
  <BrowserRouter>
    <AppRoutes />
    <Toaster position="top-right" />
  </BrowserRouter>
  ```

#### `src/AppProvider.tsx`
- **Purpose**: Wraps app with all Context providers
- **What it does**: Provides Auth, UI, and Maintenance contexts to entire app
- **Order matters**: Auth → UI → Maintenance (nested)

---

### Types (`src/types/`)

#### `user.ts`
- **Exports**: `Role` type, `User` interface
- **Role**: `"main_admin" | "company_admin" | "employee"`
- **User**: `{ id, name, email, role, companyId?, avatar? }`

#### `equipment.ts`
- **Exports**: `Equipment`, `EquipmentFormData`
- **Equipment**: Full equipment record with relationships
- **EquipmentFormData**: Form input type (without id, timestamps)

#### `maintenance.ts`
- **Exports**: `MaintenanceRequest`, `MaintenanceRequestFormData`, stage/type enums
- **Stages**: `"new" | "in_progress" | "repaired" | "scrap"`
- **Types**: `"corrective" | "preventive"`

#### `team.ts`
- **Exports**: `MaintenanceTeam`, `TeamMember`, `MaintenanceTeamFormData`

#### `company.ts`
- **Exports**: `Company` interface

---

### Services (`src/services/`)

#### `api.ts`
- **Purpose**: Centralized Axios instance
- **Features**:
  - Base URL from `VITE_API_BASE_URL` env variable
  - Request interceptor: Adds auth token from localStorage
  - Response interceptor: Handles 401 (unauthorized) → redirects to login
- **Usage**: Import `api` in service files

#### `auth.service.ts`
- **Methods**:
  - `login(credentials)`: Authenticates user, stores token
  - `logout()`: Clears token
  - `getCurrentUser()`: Fetches current user data
- **Returns**: Typed responses matching `types/user.ts`

#### `equipment.service.ts`
- **Methods**: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Special**: `getByDepartment()`, `getByEmployee()`, `getMaintenanceRequests()`
- **All methods return**: Typed `Equipment` or arrays

#### `maintenance.service.ts`
- **Methods**: Standard CRUD + specialized:
  - `updateStage(id, stage)`: Changes request stage
  - `assign(id, userId)`: Assigns request to user
  - `updateDuration(id, duration)`: Records hours spent
  - `getPreventive()`: Filters preventive requests
  - `getByEquipment(equipmentId)`: Gets requests for equipment

#### `team.service.ts` & `company.service.ts`
- **Standard CRUD operations** for teams and companies

---

### Context (`src/context/`)

#### `AuthContext.tsx`
- **State**: `user`, `token`
- **Methods**: `login()`, `logout()`
- **Persistence**: Stores user/token in localStorage
- **Initialization**: Reads from localStorage on mount
- **Hook**: `useAuth()` - use in components

#### `UIContext.tsx`
- **State**: `sidebarOpen` (boolean)
- **Methods**: `toggleSidebar()`
- **Purpose**: Controls sidebar visibility (mobile/desktop)
- **Hook**: `useUI()`

#### `MaintenanceContext.tsx`
- **State**: `requests[]`, `loading`
- **Methods**: `fetchRequests()`, `updateRequest()`
- **Purpose**: Optional global state for maintenance requests
- **Note**: Can be used instead of local state in components

---

### Hooks (`src/hooks/`)

#### `useAuth.ts`
- **Purpose**: Wrapper around `AuthContext`
- **Returns**: `{ user, token, login, logout }`

#### `useRole.ts`
- **Exports**:
  - `useRole()`: Returns current user's role
  - `useHasRole(allowedRoles[])`: Returns boolean if user has allowed role

#### `useDebounce.ts`
- **Purpose**: Debounces value changes
- **Usage**: `const debouncedValue = useDebounce(value, 300)`
- **Use case**: Search input debouncing

---

### Utils (`src/utils/`)

#### `date.ts`
- **Functions**:
  - `formatDate(date)`: "MMM DD, YYYY"
  - `formatDateTime(date)`: "MMM DD, YYYY HH:mm"
  - `isOverdue(date)`: Checks if date is past
  - `isToday()`, `isPast()`, `isFuture()`

#### `constants.ts`
- **Exports**:
  - `MAINTENANCE_STAGES`, `MAINTENANCE_TYPES`, `EQUIPMENT_STATUS`
  - `STAGE_LABELS`, `TYPE_LABELS`: Human-readable labels
  - `STAGE_COLORS`: Tailwind classes for stage badges

#### `permissions.ts`
- **Functions**: `canManageEquipment()`, `canManageTeams()`, etc.
- **Purpose**: Role-based permission checks
- **Returns**: Boolean

---

### Components - UI (`src/components/ui/`)

All shadcn/ui components follow same pattern:
- Forward refs for DOM access
- `cn()` utility for className merging
- Variant props using `class-variance-authority`

#### `button.tsx`
- **Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Sizes**: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`

#### `card.tsx`
- **Sub-components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

#### `input.tsx`, `textarea.tsx`, `select.tsx`
- Standard form inputs with Tailwind styling

#### `badge.tsx`
- **Variants**: `default`, `secondary`, `destructive`, `outline`
- Used for status indicators

#### `avatar.tsx`
- **Sub-components**: `Avatar`, `AvatarImage`, `AvatarFallback`
- Shows user avatars with fallback to initials

#### `dialog.tsx`
- Modal component
- **Usage**: `<Dialog open={open} onOpenChange={setOpen}>`

---

### Components - Common (`src/components/common/`)

#### `Loader.tsx`
- **Purpose**: Spinning loader icon
- **Props**: `size` (`"sm" | "md" | "lg"`), `className`
- **Uses**: `lucide-react` `Loader2` icon

#### `EmptyState.tsx`
- **Purpose**: Empty state placeholder
- **Props**: `icon`, `title`, `description`, `action` (button)
- **Use case**: When lists are empty

---

### Components - Kanban (`src/components/kanban/`)

#### `KanbanCard.tsx`
- **Purpose**: Individual request card
- **Features**:
  - Wrapped in `Draggable` from `@hello-pangea/dnd`
  - Shows request details (subject, equipment, stage, type)
  - Overdue indicator (red border)
  - Assigned user avatar
- **Props**: `request`, `index` (for drag), `onClick`

#### `KanbanColumn.tsx`
- **Purpose**: Column container for a stage
- **Features**:
  - Wrapped in `Droppable`
  - Shows stage label and count
  - Renders `KanbanCard` components
- **Props**: `stage`, `requests[]`, `onCardClick`

#### `KanbanBoard.tsx`
- **Purpose**: Main kanban board container
- **Features**:
  - Wrapped in `DragDropContext`
  - Handles drag end: Updates request stage via API
  - Groups requests by stage
  - Shows all 4 stages: New, In Progress, Repaired, Scrap
- **Props**: `requests[]`, `onUpdate()` (refresh callback), `onCardClick`

---

### Components - Calendar (`src/components/calendar/`)

#### `MaintenanceCalendar.tsx`
- **Purpose**: FullCalendar wrapper for preventive maintenance
- **Features**:
  - Filters to show only preventive requests
  - Click date to create new request
  - Click event to view details
  - Opens dialog with request details
- **Props**: `requests[]`, `onDateClick()`, `onEventClick()`

---

### Components - Layout (`src/components/layout/`)

#### `Sidebar.tsx`
- **Purpose**: Navigation sidebar
- **Features**:
  - Role-based menu items
  - Active route highlighting
  - Mobile responsive (overlay on mobile)
  - User info at bottom
- **Menu items**: Different per role (see `getNavItems()`)

#### `Header.tsx`
- **Purpose**: Top navigation bar
- **Features**:
  - Mobile menu toggle button
  - User name display
  - Logout button
- **Logout**: Calls `authService.logout()` and navigates to login

#### `PageWrapper.tsx`
- **Purpose**: Wraps pages with Sidebar + Header
- **Features**:
  - Responsive layout
  - Adjusts margin when sidebar open
- **Usage**: Used by all layout components

---

### Layouts (`src/layouts/`)

All three layouts (`MainAdminLayout`, `CompanyAdminLayout`, `EmployeeLayout`) are identical wrappers around `PageWrapper`. They exist for:
- Type safety
- Future role-specific customizations
- Clear separation of concerns

---

### Pages (`src/pages/`)

#### Auth Pages

**`auth/Login.tsx`**
- **Purpose**: Login form
- **Features**:
  - Email/password form
  - Calls `authService.login()`
  - Stores token, navigates based on role
  - Shows loading state
  - Toast notifications

#### Main Admin Pages

**`main-admin/Dashboard.tsx`**
- **Purpose**: System-wide statistics
- **Shows**: Companies count, Equipment count, Requests count
- **Data**: Fetches from multiple services

**`main-admin/Companies.tsx`**
- **Purpose**: Company management
- **Features**: List view, search (future), create button
- **Data**: `companyService.getAll()`

#### Company Admin Pages

**`company-admin/Dashboard.tsx`**
- **Purpose**: Company-specific overview
- **Shows**: Equipment, Total Requests, Open Requests, Completed
- **Data**: Aggregated from equipment and maintenance services

**`company-admin/Equipment.tsx`**
- **Purpose**: Equipment list with search
- **Features**:
  - Search by name/serial/location (debounced)
  - Card grid layout
  - Status badges
  - Link to detail page (future)
- **Data**: `equipmentService.getAll()`

**`company-admin/Teams.tsx`**
- **Purpose**: Maintenance teams list
- **Shows**: Team name, description, members with avatars
- **Data**: `teamService.getAll()`

**`company-admin/MaintenanceRequests.tsx`**
- **Purpose**: Kanban board for all requests
- **Features**: Full kanban board, create button
- **Data**: `maintenanceService.getAll()`

**`company-admin/PreventiveSchedule.tsx`**
- **Purpose**: Calendar view for preventive maintenance
- **Features**: FullCalendar, click to create, event details
- **Data**: `maintenanceService.getPreventive()`

**`company-admin/Reports.tsx`**
- **Purpose**: Reports and analytics (placeholder)
- **Future**: Charts, pivot tables, graphs

#### Employee Pages

**`employee/Dashboard.tsx`**
- **Purpose**: Employee's personal stats
- **Shows**: My Requests, Open, Completed
- **Data**: Filtered by `assignedToId === user.id`

**`employee/MyRequests.tsx`**
- **Purpose**: List of assigned requests
- **Shows**: Request cards with details
- **Data**: Filtered maintenance requests

**`employee/Kanban.tsx`**
- **Purpose**: Kanban board (same as company admin, but employee view)
- **Features**: Drag & drop to update status

---

### Routes (`src/routes/`)

#### `AppRoutes.tsx`
- **Purpose**: Main routing configuration
- **Structure**:
  - Public route: `/login`
  - Role-based nested routes:
    - `/main-admin/*` → MainAdminLayout
    - `/company-admin/*` → CompanyAdminLayout
    - `/employee/*` → EmployeeLayout
  - Default redirect: `/dashboard` → role-based dashboard
- **Protection**: All routes wrapped in `ProtectedRoute` and `RoleGuard`

#### `ProtectedRoute.tsx`
- **Purpose**: Requires authentication
- **Logic**: Checks `user` and `token` from `AuthContext`
- **Redirect**: `/login` if not authenticated

#### `RoleGuard.tsx`
- **Purpose**: Requires specific role(s)
- **Props**: `allowedRoles[]`
- **Logic**: Checks if user's role is in `allowedRoles`
- **Redirect**: `/dashboard` if wrong role

---

## Data Flow

### Authentication Flow
1. User enters credentials in `Login.tsx`
2. Calls `authService.login()` → API request
3. Receives `{ user, token }`
4. `AuthContext.login()` stores in state + localStorage
5. Navigate to role-based dashboard
6. `ProtectedRoute` checks auth on route changes

### Request Creation Flow
1. User fills form (future: dialog/modal)
2. Calls `maintenanceService.create(data)`
3. API returns new request
4. Component updates local state or calls `fetchRequests()`
5. UI re-renders with new request

### Kanban Drag & Drop Flow
1. User drags card in `KanbanBoard`
2. `DragDropContext` fires `onDragEnd`
3. Extracts `draggableId` (request id) and `destination.droppableId` (new stage)
4. Calls `maintenanceService.updateStage(id, newStage)`
5. On success: `onUpdate()` callback refreshes data
6. UI updates with new stage

### Equipment Auto-Fill Flow (Future)
1. User selects equipment in request form
2. Form component calls `equipmentService.getById(id)`
3. Receives equipment with `maintenanceTeamId`, `category`, etc.
4. Auto-fills form fields
5. User completes and submits

---

## Key Patterns & Conventions

### 1. **Service Layer Pattern**
- All API calls go through service files
- Services return typed data
- Services handle errors (throw to caller)
- Components call services, not API directly

### 2. **Context for Global State**
- `AuthContext`: User/token (persisted)
- `UIContext`: UI state (sidebar)
- `MaintenanceContext`: Optional global requests state

### 3. **Type Safety**
- All data structures defined in `types/`
- Services return typed responses
- Components use typed props

### 4. **Component Composition**
- Small, reusable components
- Layout components wrap pages
- UI components from shadcn/ui

### 5. **Error Handling**
- Toast notifications for user feedback
- Try/catch in service calls
- API interceptor handles 401 globally

### 6. **Loading States**
- `loading` state in components
- `<Loader />` component during fetch
- Empty states when no data

### 7. **Responsive Design**
- Mobile-first with Tailwind
- Sidebar collapses on mobile
- Grid layouts adapt to screen size

---

## Component Architecture

### Component Hierarchy
```
App
└── BrowserRouter
    └── AppRoutes
        └── ProtectedRoute
            └── RoleGuard
                └── Layout (MainAdmin/CompanyAdmin/Employee)
                    └── PageWrapper
                        ├── Sidebar
                        ├── Header
                        └── Page Component
                            └── Feature Components (Kanban, Calendar, etc.)
```

### Data Fetching Pattern
```tsx
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.getAll();
      setData(result);
    } catch (error) {
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

if (loading) return <Loader />;
if (data.length === 0) return <EmptyState />;
return <DataList data={data} />;
```

---

## State Management

### Local State (useState)
- Component-specific data
- Form inputs
- UI toggles (dialogs, modals)

### Context State
- **AuthContext**: Global user/token
- **UIContext**: Global UI state
- **MaintenanceContext**: Optional global requests

### Server State
- Fetched on mount (`useEffect`)
- Refreshed after mutations
- Not persisted in client

---

## Routing System

### Route Structure
```
/login (public)
/main-admin/*
  /dashboard
  /companies
/company-admin/*
  /dashboard
  /equipment
  /teams
  /maintenance-requests
  /preventive-schedule
  /reports
/employee/*
  /dashboard
  /my-requests
  /kanban
```

### Route Protection
1. **Public**: `/login` (no protection)
2. **Protected**: All others require auth
3. **Role-Guarded**: Nested routes check role

### Navigation
- Use `Link` from `react-router-dom` for internal links
- Use `useNavigate()` hook for programmatic navigation
- `Navigate` component for redirects

---

## API Integration

### Base URL
- Set in `.env`: `VITE_API_BASE_URL=http://localhost:8069/api`
- Used in `services/api.ts`

### Expected Endpoints
```
POST   /auth/login
POST   /auth/logout
GET    /auth/me

GET    /equipment
GET    /equipment/:id
POST   /equipment
PUT    /equipment/:id
DELETE /equipment/:id
GET    /equipment/:id/maintenance-requests

GET    /teams
GET    /teams/:id
POST   /teams
PUT    /teams/:id
DELETE /teams/:id

GET    /maintenance-requests
GET    /maintenance-requests/:id
POST   /maintenance-requests
PUT    /maintenance-requests/:id
PATCH  /maintenance-requests/:id/stage
PATCH  /maintenance-requests/:id/assign
PATCH  /maintenance-requests/:id/duration

GET    /companies (main admin only)
```

### Request/Response Format
- **Request**: JSON body, `Content-Type: application/json`
- **Response**: JSON data matching TypeScript types
- **Auth**: `Authorization: Bearer <token>` header (auto-added)

### Error Handling
- 401: Auto-redirect to login (interceptor)
- Other errors: Caught in try/catch, show toast

---

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/[role]/NewPage.tsx`
2. Add route in `src/routes/AppRoutes.tsx`
3. Add nav item in `src/components/layout/Sidebar.tsx` (if needed)

### Adding a New Service Method
1. Add method to appropriate service file
2. Use typed request/response
3. Call `api.get/post/put/delete()`
4. Return typed data

### Creating a Form Dialog
1. Use `Dialog` component from `ui/dialog.tsx`
2. Create form with `Input`, `Select`, `Textarea`
3. Handle submit → call service → close dialog → refresh data

### Adding a New Role
1. Add role to `types/user.ts` `Role` type
2. Update `routes/AppRoutes.tsx` with new route
3. Create layout in `layouts/`
4. Create pages in `pages/[new-role]/`
5. Update `Sidebar.tsx` `getNavItems()`
6. Update `permissions.ts` if needed

### Implementing Smart Button on Equipment
1. In `Equipment.tsx` detail page (future):
   ```tsx
   const [requests, setRequests] = useState([]);
   useEffect(() => {
     equipmentService.getMaintenanceRequests(equipmentId)
       .then(setRequests);
   }, [equipmentId]);
   
   <Button>
     Maintenance ({requests.filter(r => r.stage !== 'repaired').length})
   </Button>
   ```

### Adding Charts/Reports
1. Install chart library (e.g., `recharts`)
2. Create report component
3. Fetch aggregated data from API
4. Render chart with data

---

## Environment Setup

### Required Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8069/api
```

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run build  # TypeScript check included
```

---

## Dependencies

### Core
- `react`, `react-dom`: React framework
- `react-router-dom`: Routing
- `typescript`: Type safety

### UI
- `tailwindcss`: Styling
- `lucide-react`: Icons
- `class-variance-authority`: Component variants
- `clsx`, `tailwind-merge`: Class utilities

### Features
- `@fullcalendar/react`: Calendar
- `@hello-pangea/dnd`: Drag & drop
- `axios`: HTTP client
- `dayjs`: Date handling
- `react-hot-toast`: Notifications

---

## Next Steps for Development

1. **Forms & Dialogs**
   - Create/Edit Equipment form
   - Create/Edit Team form
   - Create/Edit Request form
   - Assignment dialog

2. **Equipment Detail Page**
   - Show full equipment info
   - Smart button for maintenance requests
   - Edit/Delete actions

3. **Reports**
   - Install chart library
   - Create pivot/graph views
   - Team performance metrics
   - Equipment utilization

4. **Advanced Features**
   - File uploads (equipment images)
   - Notifications system
   - Email integration
   - Export to PDF/Excel

5. **Testing**
   - Unit tests (Jest/Vitest)
   - Component tests (React Testing Library)
   - E2E tests (Playwright/Cypress)

---

## Notes for Future Developers

- **Type Safety**: Always use TypeScript types from `types/` folder
- **API Calls**: Always go through service layer, never direct axios calls
- **State**: Use Context for global state, useState for local
- **Styling**: Use Tailwind classes, shadcn/ui components
- **Routing**: All routes are protected except `/login`
- **Error Handling**: Show toast notifications, don't silently fail
- **Loading States**: Always show loader during async operations
- **Empty States**: Show helpful empty state when no data

---

## Contact & Support

For questions about this codebase, refer to:
- `README.md` for project overview
- This file for detailed architecture
- Type definitions in `src/types/` for data structures
- Service files for API integration details

