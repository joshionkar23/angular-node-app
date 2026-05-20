import { describe, it, expect, vi } from 'vitest';
import { CategoryController } from './category.controller';

const makeRes = () => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const send = vi.fn();
  return { status, json, send } as any;
};

describe('CategoryController', () => {
  it('returns 201 on create', async () => {
    const service = { createCategory: vi.fn().mockResolvedValue({ id: '1', name: 'x' }), listCategories: vi.fn() } as any;
    const controller = new CategoryController(service);
    const req = { body: { name: 'x', slug: 'x' } } as any;
    const res = makeRes();
    await controller.create(req, res);
    expect(service.createCategory).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
