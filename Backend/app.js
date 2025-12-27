import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/userRoutes.js";
import companyRouter from "./routes/companyRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// CORS configuration with environment variables
const frontendUrls = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',') 
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? frontendUrls 
        : [...frontendUrls, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}));

// Rate limiting

const authLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/register', authLimiter);
// app.use('/api/', generalLimiter);

// Health check endpoint
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'Server is running',
//         timestamp: new Date().toISOString(),
//         environment: process.env.NODE_ENV,
//         app: process.env.APP_NAME,
//         version: process.env.API_VERSION || 'v1',
//         database: 'connected'
//     });
// });

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: `${process.env.APP_NAME} API is working!`,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1'
    });
});

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/employees", employeeRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

process.on("uncaughtException", (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

export default app;
