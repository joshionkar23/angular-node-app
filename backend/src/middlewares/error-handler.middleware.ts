import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { logger } from "../config/logger.js";
import { HttpError } from "../utils/http-error.js";

export const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof Joi.ValidationError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.details.map((d) => ({ field: d.path.join("."), message: d.message })),
        requestId: req.requestId
      }
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: {
        code: "HTTP_ERROR",
        message: err.message,
        details: err.details,
        requestId: req.requestId
      }
    });
    return;
  }

  logger.error("Unhandled error", { err, requestId: req.requestId });

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error",
      requestId: req.requestId
    }
  });
};
