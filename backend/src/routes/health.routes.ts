import { Router } from "express";
import mongoose from "mongoose";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

healthRouter.get("/ready", (_req, res) => {
  const isDatabaseReady = mongoose.connection.readyState === 1;

  if (!isDatabaseReady) {
    res.status(503).json({
      status: "degraded",
      dependencies: {
        mongodb: "disconnected"
      }
    });
    return;
  }

  res.status(200).json({
    status: "ready",
    dependencies: {
      mongodb: "connected"
    }
  });
});
