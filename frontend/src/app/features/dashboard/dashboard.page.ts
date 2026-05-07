import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { EcommerceApiService } from '../../core/api/ecommerce-api.service';
import { CartStore } from '../../core/cart/cart.store';
import { Product } from '../../models/api.models';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterLink
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPageComponent {
  readonly authService = inject(AuthService);
  readonly cartStore = inject(CartStore);

  private readonly api = inject(EcommerceApiService);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.loadProducts();
    this.cartStore.refreshCart();
  }

  loadProducts() {
    this.loading.set(true);
    this.api.getProducts().subscribe({
      next: (items) => {
        this.products.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product) {
    this.api.addToCart(product.id, 1).subscribe({
      next: (cart) => this.cartStore.setCart(cart)
    });
  }

  logout() {
    this.authService.logout();
    this.cartStore.clear();
    void this.router.navigate(['/auth']);
  }
}
