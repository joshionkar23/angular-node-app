import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-admin-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-category-form.page.html',
  styleUrls: ['./admin-category-form.page.scss']
})
export class AdminCategoryFormPage {
  name = '';
  slug = '';
  description = '';
  imageUrl = '';

  readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly svc = inject(CategoryService);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.svc.get(id).subscribe({ next: (r) => {
        const c = r.data; this.name = c.name; this.slug = c.slug; this.description = c.description ?? ''; this.imageUrl = c.imageUrl ?? '';
      }});
    }
  }

  save() {
    const id = this.route.snapshot.paramMap.get('id');
    const payload = { name: this.name, slug: this.slug, description: this.description, imageUrl: this.imageUrl };
    if (id) {
      this.svc.update(id, payload).subscribe({ next: () => this.router.navigate(['/admin/categories']) });
    } else {
      this.svc.create(payload).subscribe({ next: () => this.router.navigate(['/admin/categories']) });
    }
  }
}
