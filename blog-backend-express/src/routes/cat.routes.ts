import { Router } from "express";

import CatController from "@/controller/cat.controller";

import { verifyJWT } from "@/middlewares/auth.middleware";
import { validateQuery, validateRequest } from "@/middlewares/validateRequest.middleware";

import {
  categoryCreateSchema,
  categoryUpdateSchema,
  paginationQuerySchema,
} from "@/schemas/cat.schemas";

const router = Router();
const catController = new CatController();

router.use(verifyJWT);


router.get(
  "/",
  validateQuery(paginationQuerySchema),
  catController.getAllCategories,
);

router.get(
  "/:id",
  catController.getCategory,
);

router.post(
  "/new",
  validateRequest(categoryCreateSchema),
  catController.registerCategory,
);

router.put(
  "/:id",
  validateRequest(categoryUpdateSchema),
  catController.updateCategory,
);

router.delete(
  "/:id",
  catController.deleteCategory,
);

export default router;