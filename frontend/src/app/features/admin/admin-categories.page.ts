import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CategoryService, CategoryDto } from '../../core/services/category.service';
import {
  CategoryFormDialog,
  CategoryFormDialogData,
  CategoryFormResult
} from './category-form.dialog';
import { ConfirmDeleteDialog } from './confirm-delete.dialog';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './admin-categories.page.html',
  styleUrls: ['./admin-categories.page.scss']
})
export class AdminCategoriesPage {
  private readonly svc = inject(CategoryService);
  private readonly dialog = inject(MatDialog);

  private readonly categoriesResource = rxResource({
    stream: () => this.svc.list()
  });

  readonly loading = this.categoriesResource.isLoading;
  readonly categories = computed<CategoryDto[] | null>(() => {
    const response = this.categoriesResource.value();
    if (response) return response.data;
    return this.categoriesResource.error() ? [] : null;
  });

  openAddDialog() {
    const ref = this.dialog.open<CategoryFormDialog, CategoryFormDialogData, CategoryFormResult>(
      CategoryFormDialog,
      { data: {} }
    );
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.svc.create(result).subscribe({
        next: () => this.categoriesResource.reload()
      });
    });
  }

  openEditDialog(id: string) {
    this.svc.get(id).subscribe({
      next: (r) => {
        const ref = this.dialog.open<CategoryFormDialog, CategoryFormDialogData, CategoryFormResult>(
          CategoryFormDialog,
          { data: { category: r.data } }
        );
        ref.afterClosed().subscribe((result) => {
          if (!result) return;
          this.svc.update(id, result).subscribe({
            next: () => this.categoriesResource.reload()
          });
        });
      }
    });
  }

  openDeleteDialog(id: string) {
    const ref = this.dialog.open<ConfirmDeleteDialog, void, boolean>(ConfirmDeleteDialog);
    ref.afterClosed()
      .pipe(switchMap((confirmed) => (confirmed ? this.svc.delete(id) : [])))
      .subscribe(() => this.categoriesResource.reload());
  }
}
