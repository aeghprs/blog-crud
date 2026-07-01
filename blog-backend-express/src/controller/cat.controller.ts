import { Request, Response } from "express";

import { IRegisterCategory, IUpdateCategory } from "@/schemas/cat.schemas";

import CategoryService from "@/services/cat.services";

const categoryService = new CategoryService();

class CategoryController {
  public async registerCategory(req: Request, res: Response) {
    try {
      const categoryData: IRegisterCategory = req.body;

      const category = await categoryService.registerCategory(categoryData);

      res.status(201).json({
        success: true,
        message: "Category Registration successful.",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Category registration failed",
      });
    }
  }

  public async getAllCategories(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await categoryService.getAllCategories(page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve categories",
      });
    }
  }

  public async getCategory(req: Request, res: Response) {
    try {
      const categoryId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const category = await categoryService.getCategoryById(categoryId);
      if (!category)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });

      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve category",
        error: error.message,
      });
    }
  }

  public async updateCategory(req: Request, res: Response) {
    try {
      const categoryId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const updateData: IUpdateCategory = req.body;
      const category = await categoryService.updateCategory(
        categoryId,
        updateData,
      );
      if (!category)
        return res
          .status(404)
          .json({
            success: false,
            message: "Category not found or no updates",
          });

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update category",
        error: error.message,
      });
    }
  }

  public async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const success = await categoryService.deleteCategory(categoryId);
      if (!success)
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });

      res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to delete category",
        error: error.message,
      });
    }
  }
}

export default CategoryController;
