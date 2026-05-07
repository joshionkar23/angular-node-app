import { NextFunction, Request, Response } from "express";
import winston from "winston";
import { env } from "./env.js";

const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} [${level}]: ${String(message)}${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), json());

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: env.NODE_ENV === "development" ? devFormat : prodFormat,
  transports: [new winston.transports.Console()]
});

export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on("finish", () => {
    logger.http(`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      responseTime: `${Date.now() - start}ms`,
      requestId: req.requestId
    });
  });
  next();
};
