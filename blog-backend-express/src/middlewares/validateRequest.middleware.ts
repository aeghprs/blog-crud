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