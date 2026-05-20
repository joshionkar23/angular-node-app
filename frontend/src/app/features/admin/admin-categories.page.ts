import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryDto } from '../../core/services/category.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-categories.page.html',
  styleUrls: ['./admin-categories.page.scss']
})
export class AdminCategoriesPage implements OnInit {
  private readonly svc = new CategoryService();
  categories = signal<CategoryDto[] | null>(null);
  loading = signal(false);
  modalVisible = signal(false);
  name = '';
  slug = '';
  description = '';
  imageUrl = '';
  editingId = signal<string | null>(null);
  deleteModalVisible = signal(false);
  deleteCandidateId: string | null = null;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.list().subscribe({
      next: (res) => this.categories.set(res.data),
      error: () => this.categories.set([]),
      complete: () => this.loading.set(false)
    });
  }

  deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    this.svc.delete(id).subscribe({ next: () => this.load() });
  }

  openModal() {
    this.name = '';
    this.slug = '';
    this.description = '';
    this.imageUrl = '';
    this.modalVisible.set(true);
  }

  closeModal() {
    this.modalVisible.set(false);
  }

  createCategory() {
    const payload = { name: this.name, slug: this.slug, description: this.description, imageUrl: this.imageUrl };
    const id = this.editingId();
    if (id) {
      this.svc.update(id, payload).subscribe({ next: () => {
        this.closeModal();
        this.editingId.set(null);
        this.load();
      }});
    } else {
      this.svc.create(payload).subscribe({ next: () => {
        this.closeModal();
        this.load();
      }});
    }
  }

  openEditModal(id: string) {
    this.svc.get(id).subscribe({ next: (r) => {
      const c = r.data;
      this.name = c.name;
      this.slug = c.slug;
      this.description = c.description ?? '';
      this.imageUrl = c.imageUrl ?? '';
      this.editingId.set(id);
      this.modalVisible.set(true);
    }});
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
    this.svc.delete(id).subscribe({ next: () => {
      this.closeDeleteModal();
      this.load();
    }});
  }
}
