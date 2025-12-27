# GearGuard Backend API

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create `.env` file (see SETUP_GUIDE.md)

3. **Create main admin**
   ```bash
   npm run create-admin
   ```

4. **Start server**
   ```bash
   npm run dev
   ```

## API Routes

### Authentication
- `POST /api/v1/users/register` - Register user
- `POST /api/v1/users/login` - Login
- `POST /api/v1/users/logout` - Logout
- `GET /api/v1/users/profile` - Get profile

### Companies (Main Admin)
- `GET /api/v1/companies` - List all
- `POST /api/v1/companies` - Create
- `GET /api/v1/companies/:id` - Get one
- `PUT /api/v1/companies/:id` - Update
- `DELETE /api/v1/companies/:id` - Delete

### Employees (Company Admin)
- `GET /api/v1/employees` - List all
- `POST /api/v1/employees` - Create
- `PUT /api/v1/employees/:id` - Update
- `PUT /api/v1/employees/:id/role` - Change role
- `DELETE /api/v1/employees/:id` - Delete

### Categories (Company Admin)
- `GET /api/v1/categories` - List all
- `POST /api/v1/categories` - Create
- `GET /api/v1/categories/:id` - Get one
- `PUT /api/v1/categories/:id` - Update
- `DELETE /api/v1/categories/:id` - Delete
- `POST /api/v1/categories/:id/assign` - Assign employee
- `DELETE /api/v1/categories/:id/assign/:employeeId` - Remove employee

## Models

- **User**: Authentication and user data
- **Company**: Company information
- **MaintenanceCategory**: Maintenance departments (Mechanic, Electronic, etc.)
- **Equipment**: Company assets
- **MaintenanceRequest**: Maintenance requests
- **MaintenanceAssignment**: Task assignments

## Authentication

All protected routes require:
- `Authorization: Bearer <token>` header
- Valid JWT token
- Active user account

## Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```
