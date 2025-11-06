import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import process from "process";
import mongoose from "mongoose";

import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddlware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddlware);

//middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);

// HEALTH CHECK
app.get("/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({
      status: "OK",
      uptime: process.uptime(),
      db: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: "DB_DOWN", error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the subscription Tracker API:>");
});

app.use(errorMiddleware);

// GLOBAL ERROR HANDLERS
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.errorr(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

app.listen(PORT, async () => {
  console.log(`Server running on port http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;
