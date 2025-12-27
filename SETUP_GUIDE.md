# GearGuard - Complete Setup Guide

## 🎯 System Overview

### User Roles & Hierarchy
1. **PLATFORM_ADMIN** (Main Admin)
   - Static user, created by script
   - Manages companies and company admins
   - System-wide access

2. **COMPANY_ADMIN**
   - Registers with company details
   - Manages employees (EMPLOYEE and MAINTENANCE_TEAM)
   - Creates maintenance categories
   - Assigns employees to categories
   - Assigns tasks to maintenance employees

3. **MAINTENANCE_TEAM**
   - Assigned to maintenance categories
   - Handles maintenance requests
   - Updates request status

4. **EMPLOYEE**
   - Creates maintenance requests
   - Views own requests

## 🚀 Backend Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Environment Variables
Create `.env` file in `Backend/`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/gearguard
DB_NAME=gearguard

# Server
PORT=5000
NODE_ENV=development
APP_NAME=GearGuard API
API_VERSION=v1

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# CORS
FRONTEND_URL=http://localhost:5173

# Main Admin (for script)
MAIN_ADMIN_EMAIL=admin@gearguard.com
MAIN_ADMIN_PASSWORD=Admin@123
```

### 3. Create Main Admin
```bash
npm run create-admin
```

This creates the static PLATFORM_ADMIN user.

### 4. Start Backend
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Start Frontend
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📋 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register (with company details for COMPANY_ADMIN)
- `POST /api/v1/users/login` - Login
- `POST /api/v1/users/logout` - Logout
- `GET /api/v1/users/profile` - Get current user

### Companies (Main Admin)
- `GET /api/v1/companies` - Get all companies
- `POST /api/v1/companies` - Create company
- `GET /api/v1/companies/:id` - Get company by ID
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company

### Employees (Company Admin)
- `GET /api/v1/employees` - Get all employees
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/:id` - Update employee
- `PUT /api/v1/employees/:id/role` - Change role (EMPLOYEE ↔ MAINTENANCE_TEAM)
- `DELETE /api/v1/employees/:id` - Delete employee

### Maintenance Categories (Company Admin)
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category
- `POST /api/v1/categories/:id/assign` - Assign employee to category
- `DELETE /api/v1/categories/:id/assign/:employeeId` - Remove employee from category

## 🔄 Registration Flow

### Company Admin Registration
1. User selects "Company Admin" role
2. Fills personal details (name, email, password, phone)
3. Fills company details form (name, email, phone, address)
4. System creates company first, then user
5. User is auto-logged in and redirected to dashboard

### Employee Registration
1. User selects "Employee" role
2. Fills personal details only
3. System creates user (no company association yet)
4. Company admin can later assign them to company

## 🎯 Key Features

### Company Admin Features
1. **Employee Management**
   - Create employees
   - Switch employees between EMPLOYEE and MAINTENANCE_TEAM roles
   - Assign maintenance team members to categories

2. **Maintenance Categories**
   - Create categories (Mechanic, Electronic, IT Support, etc.)
   - Set maximum employees per category
   - Assign maintenance employees to categories
   - View category assignments

3. **Task Assignment** (Future)
   - Assign maintenance requests to specific employees
   - Filter by category

### Main Admin Features
1. **Company Management**
   - View all companies
   - Create/edit/delete companies
   - View company details

## 📁 Backend Structure

```
Backend/
├── Models/
│   ├── user.model.js
│   ├── company.model.js
│   ├── maintenanceCategory.model.js
│   ├── equipment.model.js
│   ├── request.model.js
│   └── assignment.model.js
├── controllers/
│   ├── userController.js
│   ├── companyController.js
│   ├── categoryController.js
│   └── employeeController.js
├── routes/
│   ├── userRoutes.js
│   ├── companyRoutes.js
│   ├── categoryRoutes.js
│   └── employeeRoutes.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
└── scripts/
    └── createMainAdmin.js
```

## 🎨 Frontend Structure

```
frontend/
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx (with company details for COMPANY_ADMIN)
│   ├── main-admin/
│   │   ├── Dashboard.tsx
│   │   └── Companies.tsx (enhanced with CRUD)
│   └── company-admin/
│       ├── Dashboard.tsx
│       ├── Users.tsx (Employee Management)
│       ├── Categories.tsx (Maintenance Categories)
│       ├── Equipment.tsx
│       ├── MaintenanceRequests.tsx
│       └── ...
└── services/
    ├── company.service.ts
    ├── category.service.ts
    └── employee.service.ts
```

## ✅ Testing Checklist

### Backend
- [ ] Main admin created successfully
- [ ] Company admin registration with company details
- [ ] Employee registration (simple)
- [ ] Company admin can create employees
- [ ] Company admin can switch employee roles
- [ ] Company admin can create categories
- [ ] Company admin can assign employees to categories

### Frontend
- [ ] Login works
- [ ] Registration shows company form for COMPANY_ADMIN
- [ ] Registration is simple for EMPLOYEE
- [ ] Main admin can manage companies
- [ ] Company admin can manage employees
- [ ] Company admin can create categories
- [ ] Company admin can assign employees to categories
- [ ] Role switching works
- [ ] UI is black/white theme with icons

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB connection error**: Check MONGODB_URI in .env
- **Port already in use**: Change PORT in .env
- **JWT errors**: Check JWT_SECRET is set

### Frontend Issues
- **API calls failing**: Check VITE_API_BASE_URL in .env
- **CORS errors**: Ensure backend CORS allows frontend URL
- **401 errors**: Check token is being sent in headers

## 📝 Notes

- Main admin is static and created by script
- Company admins register with company details
- Employees register simply, company admin assigns them
- Company admin can make employees maintenance team members
- Maintenance categories are created by company admin
- Employees are assigned to categories by company admin
- All UI follows black/white theme with icons

