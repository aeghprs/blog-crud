import { Response } from "express";

import { ICreateBlogPost, IUpdateBlogPost } from "@/schemas/blog.schemas";
import BlogPostService from "@/services/blog.services";
import { AuthRequest } from "./auth.controller";

const blogPostService = new BlogPostService();

class BlogPostController {
  public async createBlogPost(req: AuthRequest, res: Response) {
    try {
      const postData: ICreateBlogPost = req.body;
      const userData = req.user;

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const post = await blogPostService.createBlogPost(userData.id, postData);

      res.status(201).json({
        success: true,
        message: "Blog post created successfully.",
        data: post,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to create blog post",
        error: error.message,
      });
    }
  }

  public async getAllBlogPostsByID(req: AuthRequest, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const userData = req.user;

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await blogPostService.getAllBlogPosts(
        page,
        limit,
        userData.id,
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog posts",
        error: error.message,
      });
    }
  }

  public async getAllBlogPosts(req: AuthRequest, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await blogPostService.getAllBlogPosts(page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog posts",
        error: error.message,
      });
    }
  }

  public async getBlogPost(req: AuthRequest, res: Response) {
    try {
      const postId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const post = await blogPostService.getBlogPostById(postId);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve blog post",
        error: error.message,
      });
    }
  }

  public async updateBlogPost(req: AuthRequest, res: Response) {
    try {
      const postId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const updateData: IUpdateBlogPost = req.body;
      const userData = req.user;

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const post = await blogPostService.updateBlogPost(
        postId,
        updateData,
        userData.id,
      );

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Blog post updated successfully",
        data: post,
      });
    } catch (error: any) {
      if (error.message === "Unauthorized to update this blog post") {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update blog post",
        error: error.message,
      });
    }
  }

  public async deleteBlogPost(req: AuthRequest, res: Response) {
    try {
      const postId = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const userData = req.user;

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const success = await blogPostService.deleteBlogPost(postId, userData.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Blog post deleted successfully",
      });
    } catch (error: any) {
      if (error.message === "Unauthorized to delete this blog post") {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete blog post",
        error: error.message,
      });
    }
  }
}

export default BlogPostController;
