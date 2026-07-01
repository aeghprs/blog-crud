import { IRegisterCategory, IUpdateCategory } from "@/schemas/cat.schemas";
import { query, queryOne } from "@/config/db";
import { PaginatedResponse } from "@/types/pagination.types";

class CategoryService {
  public async registerCategory(
    categoryData: IRegisterCategory,
  ): Promise<IRegisterCategory & { id: number }> {
    const sql = `
      INSERT INTO categories 
      (name, description)
      VALUES ($1, $2)
      RETURNING id
    `;

    const result = await queryOne<{ id: number }>(sql, [
      categoryData.name,
      categoryData.description,
    ]);

    return {
      id: result!.id,
      ...categoryData,
    };
  }

  public async getAllCategories(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<{ id: number; name: string; description: string }>> {
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ total: string }>(
      "SELECT COUNT(*) as total FROM categories",
    );

    const total = Number(countResult?.total ?? 0);

    const categories = await query<{ id: number; name: string; description: string }>(
      `SELECT id, name, description FROM categories ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
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
  ): Promise<{
    id: number;
    name: string;
    description: string;
  } | null> {
    const existingCategory = await queryOne<{
      id: number;
    }>("SELECT id FROM categories WHERE id = $1", [id]);
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

  public async deleteCategory(id: string): Promise<boolean> {
    const existingCategory = await queryOne<{
      id: number;
    }>(
      "SELECT id FROM categories WHERE id = $1",
      [id],
    );
    if (!existingCategory) return false;

    await query("DELETE FROM categories WHERE id = $1", [id]);
    return true;
  }
}

export default CategoryService;
