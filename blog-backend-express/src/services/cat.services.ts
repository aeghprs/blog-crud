import { IRegisterCategory, IUpdateCategory } from "@/schemas/cat.schemas";
import { query, queryOne } from "@/config/db";
import { PaginatedResponse } from "@/types/pagination.types";

class CategoryService {
  public async registerCategory(
    categoryData: IRegisterCategory,
    userId: number,
  ): Promise<IRegisterCategory & { id: number }> {
    const sql = `
      INSERT INTO categories 
      (user_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const result = await queryOne<{ id: number }>(sql, [
      userId,
      categoryData.name,
      categoryData.description,
    ]);

    if (!result) {
      throw new Error("Failed to register category: DB did not return an ID.");
    }

    return {
      id: result.id,
      ...categoryData,
    };
  }

  public async getAllCategories(
    page: number,
    limit: number,
    userId: number,
  ): Promise<
    PaginatedResponse<{ id: number; name: string; description: string }>
  > {
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ total: string }>(
      "SELECT COUNT(*) as total FROM categories WHERE user_id = $1",
      [userId],
    );

    const total = Number(countResult?.total ?? 0);

    const categories = await query<{
      id: number;
      name: string;
      description: string;
    }>(
      `SELECT id, name, description FROM categories where user_id = $3 ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset, userId],
    );

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getCategoryById(id: string): Promise<{
    id: number;
    name: string;
    description: string;
  } | null> {
    return queryOne<{
      id: number;
      name: string;
      description: string;
    }>(`SELECT id, name, description FROM categories WHERE id = $1`, [id]);
  }

  public async updateCategory(
    id: string,
    data: IUpdateCategory,
    userId: number,
  ): Promise<{
    id: number;
    name: string;
    description: string;
  } | null> {
    const existingCategory = await queryOne<{
      id: number;
    }>("SELECT id FROM categories WHERE id = $1 AND user_id = $2", [id, userId]);
    if (!existingCategory) return null;

    const updates: string[] = [];
    const values = [];
    let paramCount = 1;

    if (data.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(data.description || null);
    }

    if (updates.length === 0) return this.getCategoryById(id);

    values.push(id);
    await query(
      `UPDATE categories SET ${updates.join(", ")} WHERE id = $${paramCount}`,
      values,
    );

    return this.getCategoryById(id);
  }

  public async deleteCategory(id: string, userId: number): Promise<boolean> {
    const existingCategory = await queryOne<{
      id: number;
    }>("SELECT id FROM categories WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
    if (!existingCategory) return false;

    await query("DELETE FROM categories WHERE id = $1", [id]);
    return true;
  }
}

export default CategoryService;
