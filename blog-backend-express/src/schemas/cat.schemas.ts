import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(2, "Name must be 2-100 characters")
    .max(100, "Name must be 2-100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type IRegisterCategory = z.infer<typeof categoryCreateSchema>;
export type IUpdateCategory = z.infer<typeof categoryUpdateSchema>;