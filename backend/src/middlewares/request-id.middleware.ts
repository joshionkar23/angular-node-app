import { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const incomingRequestId = req.header("x-request-id");
  const requestId = incomingRequestId && incomingRequestId.trim() ? incomingRequestId : randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};
