import express from "express";
import cors from "cors";
import colors from "colors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import dotenv from "dotenv";
import userRouter from "./Routers/users.router.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/v1/users", userRouter);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    process.exit(1);
});

export default app;
