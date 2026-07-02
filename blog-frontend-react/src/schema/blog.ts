import { z } from "zod";

export const blogCreateSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .trim()
    .min(3, "Title must be 3-255 characters")
    .max(255, "Title must be 3-255 characters"),

  content: z
    .string({
      required_error: "Content is required",
    })
    .trim()
    .min(10, "Content must be at least 10 characters"),

  category_id: z.coerce
    .number({
      required_error: "Category ID is required",
    })
    .int()
    .positive(),

  excerpt: z
    .string()
    .trim()
    .max(500, "Excerpt must not exceed 500 characters")
    .nullable()
    .optional(),

  tags: z.array(z.string().trim()).optional(),
});

export const blogUpdateSchema = blogCreateSchema.partial();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type ICreateBlogPost = z.infer<typeof blogCreateSchema>;
export type IUpdateBlogPost = z.infer<typeof blogUpdateSchema>;
