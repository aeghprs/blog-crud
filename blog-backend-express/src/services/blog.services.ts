import { ICreateBlogPost, IUpdateBlogPost } from "@/schemas/blog.schemas";
import { query, queryOne } from "@/config/db";
import { PaginatedResponse } from "@/types/pagination.types";

export interface BlogPost {
  id: number;
  user_id: number;
  category_id: number | null;
  category_name?: string | null;
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

class BlogPostService {
  public async createBlogPost(
    userId: number,
    data: ICreateBlogPost,
  ): Promise<BlogPost> {
    const sql = `
      INSERT INTO posts 
      (user_id, category_id, title, content, excerpt, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, category_id, title, content, excerpt, tags, created_at, updated_at
    `;

    const result = await queryOne<BlogPost>(sql, [
      userId,
      data.category_id || null,
      data.title,
      data.content,
      data.excerpt || null,
      data.tags || null,
    ]);

    if (!result) {
      throw new Error("Failed to create blog post");
    }

    // Optionally join or fetch category name for returned response
    if (result.category_id) {
      const category = await queryOne<{ name: string }>(
        "SELECT name FROM categories WHERE id = $1",
        [result.category_id],
      );
      result.category_name = category?.name || null;
    } else {
      result.category_name = null;
    }

    return result;
  }

  public async getAllBlogPosts(
    page: number,
    limit: number,
    userId?: number,
  ): Promise<PaginatedResponse<BlogPost>> {
    const offset = (page - 1) * limit;

    const whereClause = userId ? "WHERE p.user_id = $1" : "";
    const countParams = userId ? [userId] : [];

    const countResult = await queryOne<{ total: string }>(
      `SELECT COUNT(*) AS total
     FROM posts p
     ${whereClause}`,
      countParams,
    );

    const total = Number(countResult?.total ?? 0);

    const dataParams = userId ? [userId, limit, offset] : [limit, offset];

    const posts = await query<BlogPost>(
      `
    SELECT
      p.id,
      p.user_id,
      p.category_id,
      c.name AS category_name,
      CONCAT(u.first_name, ' ', u.last_name) AS user_name,
      p.title,
      p.content,
      p.excerpt,
      p.tags,
      p.created_at,
      p.updated_at
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.user_id = u.id
    ${whereClause}
    ORDER BY p.id DESC
    LIMIT $${userId ? 2 : 1}
    OFFSET $${userId ? 3 : 2}
    `,
      dataParams,
    );

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getBlogPostById(id: string): Promise<BlogPost | null> {
    return queryOne<BlogPost>(
      `SELECT p.id, p.user_id, p.category_id, c.name as category_name, p.title, p.content, p.excerpt, p.tags, p.created_at, p.updated_at , CONCAT(u.first_name, ' ', u.last_name) as user_name
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id],
    );
  }

  public async updateBlogPost(
    id: string,
    data: IUpdateBlogPost,
    userId: number,
  ): Promise<BlogPost | null> {
    const existingPost = await queryOne<{ user_id: number }>(
      "SELECT user_id FROM posts WHERE id = $1",
      [id],
    );

    if (!existingPost) return null;

    if (existingPost.user_id !== userId) {
      throw new Error("Unauthorized to update this blog post");
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(data.content);
    }
    if (data.category_id !== undefined) {
      updates.push(`category_id = $${paramCount++}`);
      values.push(data.category_id || null);
    }
    if (data.excerpt !== undefined) {
      updates.push(`excerpt = $${paramCount++}`);
      values.push(data.excerpt || null);
    }
    if (data.tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      values.push(data.tags || null);
    }

    if (updates.length === 0) {
      return this.getBlogPostById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    await query(
      `UPDATE posts SET ${updates.join(", ")} WHERE id = $${paramCount}`,
      values,
    );

    return this.getBlogPostById(id);
  }

  public async deleteBlogPost(id: string, userId: number): Promise<boolean> {
    const existingPost = await queryOne<{ user_id: number }>(
      "SELECT user_id FROM posts WHERE id = $1",
      [id],
    );

    if (!existingPost) return false;

    if (existingPost.user_id !== userId) {
      throw new Error("Unauthorized to delete this blog post");
    }

    await query("DELETE FROM posts WHERE id = $1", [id]);
    return true;
  }
}

export default BlogPostService;
