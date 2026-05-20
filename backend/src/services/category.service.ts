import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
  constructor(private readonly repo: CategoryRepository = new CategoryRepository()) {}

  public async createCategory(input: { name: string; description?: string; slug: string; imageUrl?: string }) {
    return this.repo.create(input);
  }

  public async listCategories() {
    return this.repo.list();
  }

  public async getCategoryById(id: string) {
    return this.repo.findById(id);
  }

  public async updateCategory(id: string, updates: Partial<{ name: string; description: string; slug: string; imageUrl: string }>) {
    return this.repo.updateById(id, updates);
  }

  public async deleteCategory(id: string) {
    return this.repo.deleteById(id);
  }
}
