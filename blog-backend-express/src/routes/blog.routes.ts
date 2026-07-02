import { Router } from "express";

import BlogPostController from "@/controller/blog.controller";

import { verifyJWT } from "@/middlewares/auth.middleware";
import {
  validateQuery,
  validateRequest,
} from "@/middlewares/validateRequest.middleware";

import {
  blogCreateSchema,
  blogUpdateSchema,
  paginationQuerySchema,
} from "@/schemas/blog.schemas";

const router = Router();
const blogController = new BlogPostController();

router.use(verifyJWT);

router.get(
  "/",
  validateQuery(paginationQuerySchema),
  blogController.getAllBlogPosts,
);

router.get("/:id", blogController.getBlogPost);

router.post(
  "/new",
  validateRequest(blogCreateSchema),
  blogController.createBlogPost,
);

router.put(
  "/:id",
  validateRequest(blogUpdateSchema),
  blogController.updateBlogPost,
);

router.delete("/:id", blogController.deleteBlogPost);

export default router;
