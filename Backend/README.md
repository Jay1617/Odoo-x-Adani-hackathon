# OdooXAdani Backend API

## 🚀 Project Overview
OdooXAdani is a comprehensive backend API built with Node.js, Express, and MongoDB, featuring robust authentication, security, and user management capabilities.

## 📋 Features
- ✅ User Authentication (Register, Login, Logout)
- ✅ JWT Token-based Authorization
- ✅ Role-based Access Control
- ✅ Password Hashing with bcrypt
- ✅ Rate Limiting & Security Headers
- ✅ Input Validation
- ✅ MongoDB Integration
- ✅ Environment-based Configuration
- ✅ Comprehensive Error Handling

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

## 📁 Project Structure
```
Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── userController.js    # User-related controllers
├── Db/
│   └── index.db.js         # Database connection
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling middleware
│   ├── security.js         # Security middleware
│   └── validation.js       # Input validation middleware
├── Models/
│   └── user.model.js       # User schema/model
├── routes/
│   └── userRoutes.js       # User routes
├── .env                    # Environment variables
├── .env.example           # Environment variables template
├── app.js                 # Express app configuration
├── index.js               # Server entry point
└── package.json           # Dependencies and scripts
```

## 🔧 Environment Variables
Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://viveksinhchavda_db_user:Mew2z6wZjvXwKbXI@odooxadani.li1l2of.mongodb.net/Odoo?retryWrites=true&w=majority&appName=OdooXAdani

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-odooxadani-2024
JWT_EXPIRES_IN=7d

# Security Configuration
BCRYPT_SALT_ROUNDS=12

# CORS Configuration
FRONTEND_URL=http://localhost:3000,http://localhost:5173

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Database Configuration
DB_NAME=Odoo
COLLECTION_NAME=auth

# Application Configuration
APP_NAME=OdooXAdani
API_VERSION=v1

# Logging Configuration
LOG_LEVEL=info
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation
1. Clone the repository
2. Navigate to the Backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env` file with the required environment variables
5. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "app": "OdooXAdani",
  "version": "v1",
  "database": "connected"
}
```

#### User Registration
```http
POST /api/v1/users/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email_id": "john@example.com",
  "password": "SecurePass123!",
  "role": "EMPLOYEE",
  "phone": "+1234567890"
}
```

#### User Login
```http
POST /api/v1/users/login
```
**Body:**
```json
{
  "email_id": "john@example.com",
  "password": "SecurePass123!"
}
```

#### User Logout
```http
POST /api/v1/users/logout
```
**Headers:** `Authorization: Bearer <token>`

#### Get User Profile
```http
GET /api/v1/users/profile
```
**Headers:** `Authorization: Bearer <token>`

#### Update User Profile
```http
PUT /api/v1/users/profile
```
**Headers:** `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "Updated Name",
  "phone": "+9876543210"
}
```

### User Roles
- `PLATFORM_ADMIN`: Full system access
- `COMPANY_ADMIN`: Company-level management
- `MAINTENANCE_TEAM`: Maintenance operations
- `EMPLOYEE`: Basic user access

## 🔒 Security Features
- **Rate Limiting**: 100 requests/15min (general), 5 requests/15min (auth)
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **Request Compression**: Gzip compression for responses

## 🗄️ Database Schema

### User Collection (auth)
```javascript
{
  name: String (required),
  email_id: String (required, unique),
  password: String (required, hashed),
  role: String (enum: PLATFORM_ADMIN, COMPANY_ADMIN, MAINTENANCE_TEAM, EMPLOYEE),
  companyId: ObjectId (optional),
  maintenanceTeamId: ObjectId (optional),
  phone: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  lastLogout: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Error Handling
The API uses consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation errors if any"]
}
```

## 📝 Success Responses
All successful responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## 🔄 Development
- The server automatically restarts on file changes using nodemon
- Environment variables are loaded from `.env` file
- MongoDB connection includes retry logic and proper error handling
- Comprehensive logging for debugging

## 🚀 Deployment
1. Set `NODE_ENV=production` in environment variables
2. Update `FRONTEND_URL` with production frontend URLs
3. Use a strong `JWT_SECRET` in production
4. Ensure MongoDB Atlas network access is configured
5. Deploy to your preferred hosting platform

## 📞 Support
For issues and questions, please refer to the project documentation or contact the development team.

---
**OdooXAdani Backend API** - Built with ❤️ for robust and secure user management.