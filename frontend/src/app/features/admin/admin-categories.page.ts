import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormField, form, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { CategoryService, CategoryDto } from '../../core/services/category.service';

interface CategoryFormValue {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

const emptyForm = (): CategoryFormValue => ({
  name: '',
  slug: '',
  description: '',
  imageUrl: ''
});

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FormField],
  templateUrl: './admin-categories.page.html',
  styleUrls: ['./admin-categories.page.scss']
})
export class AdminCategoriesPage {
  private readonly svc = inject(CategoryService);

  private readonly categoriesResource = rxResource({
    stream: () => this.svc.list()
  });

  readonly loading = this.categoriesResource.isLoading;
  readonly categories = computed<CategoryDto[] | null>(() => {
    const response = this.categoriesResource.value();
    if (response) return response.data;
    return this.categoriesResource.error() ? [] : null;
  });

  private readonly model = signal<CategoryFormValue>(emptyForm());
  readonly categoryForm = form(this.model, (path) => {
    required(path.name);
    required(path.slug);
  });

  readonly modalVisible = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deleteModalVisible = signal(false);
  private deleteCandidateId: string | null = null;

  openModal() {
    this.model.set(emptyForm());
    this.editingId.set(null);
    this.modalVisible.set(true);
  }

  closeModal() {
    this.modalVisible.set(false);
  }

  saveCategory() {
    if (!this.categoryForm().valid()) return;

    const payload = this.model();
    const id = this.editingId();
    const request$ = id ? this.svc.update(id, payload) : this.svc.create(payload);

    request$.subscribe({
      next: () => {
        this.closeModal();
        this.editingId.set(null);
        this.categoriesResource.reload();
      }
    });
  }

  openEditModal(id: string) {
    this.svc.get(id).subscribe({
      next: (r) => {
        const c = r.data;
        this.model.set({
          name: c.name,
          slug: c.slug,
          description: c.description ?? '',
          imageUrl: c.imageUrl ?? ''
        });
        this.editingId.set(id);
        this.modalVisible.set(true);
      }
    });
  }

  openDeleteModal(id: string) {
    this.deleteCandidateId = id;
    this.deleteModalVisible.set(true);
  }

  closeDeleteModal() {
    this.deleteCandidateId = null;
    this.deleteModalVisible.set(false);
  }

  confirmDelete() {
    const id = this.deleteCandidateId;
    if (!id) return;
    this.svc.delete(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.categoriesResource.reload();
      }
    });
  }
}
