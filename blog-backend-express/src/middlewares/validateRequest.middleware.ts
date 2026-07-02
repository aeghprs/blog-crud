import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors?.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
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
