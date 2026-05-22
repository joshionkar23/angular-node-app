import { Component, inject, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { CategoryDto } from '../../core/services/category.service';

export interface CategoryFormDialogData {
  category?: CategoryDto;
}

export interface CategoryFormResult {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    FormField,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './category-form.dialog.html',
  styleUrls: ['./category-form.dialog.scss']
})
export class CategoryFormDialog {
  private readonly dialogRef = inject(MatDialogRef<CategoryFormDialog, CategoryFormResult>);
  readonly data = inject<CategoryFormDialogData>(MAT_DIALOG_DATA);

  private readonly model = signal<CategoryFormResult>({
    name: this.data.category?.name ?? '',
    slug: this.data.category?.slug ?? '',
    description: this.data.category?.description ?? '',
    imageUrl: this.data.category?.imageUrl ?? ''
  });

  readonly categoryForm = form(this.model, (path) => {
    required(path.name);
    required(path.slug);
  });

  save() {
    if (!this.categoryForm().valid()) return;
    this.dialogRef.close(this.model());
  }

  cancel() {
    this.dialogRef.close();
  }
}
