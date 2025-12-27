
import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectDB from "./Db/index.db.js";

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`🚀 ${process.env.APP_NAME} Server running on port: ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📊 Database: ${process.env.DB_NAME}`);
            console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM received, shutting down gracefully');
            server.close(() => {
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('🛑 SIGINT received, shutting down gracefully');
            server.close(() => {
                process.exit(0);
            });
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB connection failed:", err);
        process.exit(1);
    });