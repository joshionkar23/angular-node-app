import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api.models';

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<ApiResponse<CategoryDto[]>>(`${environment.apiBaseUrl}/categories`);
  }

  get(id: string) {
    return this.http.get<ApiResponse<CategoryDto>>(`${environment.apiBaseUrl}/categories/${id}`);
  }

  create(payload: { name: string; slug: string; description?: string; imageUrl?: string }) {
    return this.http.post<ApiResponse<CategoryDto>>(`${environment.apiBaseUrl}/categories`, payload);
  }

  update(id: string, payload: Partial<{ name: string; slug: string; description: string; imageUrl: string }>) {
    return this.http.put<ApiResponse<CategoryDto>>(`${environment.apiBaseUrl}/categories/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${environment.apiBaseUrl}/categories/${id}`);
  }
}
