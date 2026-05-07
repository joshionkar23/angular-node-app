import { Request, Response } from "express";

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.originalUrl}`,
      requestId: req.requestId
    }
  });
};
