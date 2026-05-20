import { describe, it, expect, vi } from 'vitest';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  it('creates and returns category via repository', async () => {
    const repo = {
      create: vi.fn().mockResolvedValue({ id: '1', name: 'Test', slug: 'test' }),
      list: vi.fn().mockResolvedValue([]),
      findById: vi.fn().mockResolvedValue(null),
      updateById: vi.fn().mockResolvedValue(null),
      deleteById: vi.fn().mockResolvedValue(true)
    } as any;

    const svc = new CategoryService(repo);
    const created = await svc.createCategory({ name: 'Test', slug: 'test' });
    expect(created).toEqual({ id: '1', name: 'Test', slug: 'test' });
    expect(repo.create).toHaveBeenCalled();
  });
});
