import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    if (
      req.body === undefined ||
      req.body === null ||
      (typeof req.body === "object" && Object.keys(req.body).length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            field: "body",
            message: "Request body is required",
          },
        ],
      });
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.errors.map((err) => ({
          field: err.path.length > 0 ? err.path.join(".") : "body",
          message: err.message,
        })),
      });
    }

    Object.defineProperty(req, "body", {
      value: result.data,
      configurable: true,
      enumerable: true,
      writable: true,
    });

    next();
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: result.error.flatten().fieldErrors,
      });
    }

    Object.defineProperty(req, "query", {
      value: result.data,
      configurable: true,
      enumerable: true,
      writable: true,
    });

    next();
  };
