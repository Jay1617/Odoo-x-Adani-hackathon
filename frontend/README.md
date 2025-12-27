# GearGuard - Maintenance Tracker Frontend

A React + TypeScript frontend application for the GearGuard maintenance management system, built for the Odoo x Adani hackathon.

## Features

### Core Functionality
- **Equipment Management**: Track company assets with details like serial numbers, purchase dates, locations, and assigned departments/employees
- **Maintenance Teams**: Manage specialized teams (Mechanics, Electricians, IT Support) with team members
- **Maintenance Requests**: 
  - Corrective (unplanned repairs)
  - Preventive (scheduled maintenance)
- **Kanban Board**: Drag-and-drop interface for managing request stages
- **Calendar View**: Visual schedule for preventive maintenance
- **Role-Based Access**: Three user roles (Main Admin, Company Admin, Employee)

### User Roles

#### Main Admin
- Manage companies
- View system-wide statistics
- Access to all features

#### Company Admin
- Manage equipment
- Manage maintenance teams
- Create and assign maintenance requests
- View reports and analytics
- Schedule preventive maintenance

#### Employee
- View assigned requests
- Update request status via Kanban board
- Create new maintenance requests

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **React Router** for routing
- **FullCalendar** for calendar view
- **@hello-pangea/dnd** for drag-and-drop
- **Axios** for API calls
- **react-hot-toast** for notifications
- **dayjs** for date handling

## Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets (icons, images)
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn components
│   │   ├── common/     # Common components
│   │   ├── kanban/     # Kanban board components
│   │   ├── calendar/   # Calendar components
│   │   └── layout/     # Layout components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Role-based layouts
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8069/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Key Features Implementation

### Kanban Board
- Drag and drop requests between stages (New → In Progress → Repaired → Scrap)
- Visual indicators for overdue requests
- Real-time status updates

### Calendar View
- Displays preventive maintenance requests
- Click dates to schedule new maintenance
- Event details on click

### Equipment Tracking
- Search and filter equipment
- Group by department or employee
- Smart button to view related maintenance requests

### Maintenance Requests
- Auto-fill equipment details when selecting equipment
- Assignment workflow
- Duration tracking
- Overdue detection

## API Integration

The frontend expects a REST API with the following endpoints:

- `/auth/login` - User authentication
- `/equipment` - Equipment CRUD operations
- `/teams` - Maintenance teams management
- `/maintenance-requests` - Maintenance requests CRUD
- `/companies` - Company management (Main Admin only)

All API calls are handled through service files in `src/services/`.

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the backend API (default: http://localhost:8069/api)

## Development Notes

- The app uses React Context for global state management
- Protected routes require authentication
- Role-based access control is implemented via `RoleGuard`
- All dates are handled with dayjs
- Toast notifications for user feedback
