# OdooXAdani - Optimized API Documentation

## Project Configuration
- **Project Name**: OdooXAdani
- **Database**: Odoo
- **Collection**: auth (for user management)
- **Username**: vaniyasuketu

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### 2. User Registration
```http
POST /api/users/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email_id": "john@example.com",
  "password": "SecurePass123!",
  "role": "EMPLOYEE",
  "phone": "+1234567890",
  "companyId": "optional-company-id",
  "maintenanceTeamId": "optional-team-id"
}
```

### 3. User Login
```http
POST /api/users/login
```
**Body:**
```json
{
  "email_id": "john@example.com",
  "password": "SecurePass123!"
}
```

### 4. User Logout
```http
POST /api/users/logout
```
**Headers:** `Authorization: Bearer <token>`
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Get User Profile
```http
GET /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

### 6. Update User Profile
```http
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210"
}
```

### 7. Get All Users (Admin Only)
```http
GET /api/users?page=1&limit=10
```
**Headers:** `Authorization: Bearer <admin-token>`

## User Roles
- `PLATFORM_ADMIN`: Full system access
- `COMPANY_ADMIN`: Company-level management
- `MAINTENANCE_TEAM`: Maintenance operations
- `EMPLOYEE`: Basic user access

## Security Features
- Rate limiting (100 requests/15min general, 5 requests/15min auth)
- Password hashing with bcrypt
- JWT authentication
- Input validation
- Security headers with Helmet
- CORS protection
- Request compression

## Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation errors if any"]
}
```

## Success Responses
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```