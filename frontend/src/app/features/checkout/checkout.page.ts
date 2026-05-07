import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartStore } from '../../core/cart/cart.store';
import { EcommerceApiService } from '../../core/api/ecommerce-api.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss'
})
export class CheckoutPageComponent {
  readonly cartStore = inject(CartStore);
  private readonly api = inject(EcommerceApiService);
  private readonly router = inject(Router);

  readonly placingOrder = signal(false);
  readonly message = signal('');
  readonly total = computed(() => this.cartStore.cart()?.total ?? 0);

  constructor() {
    this.cartStore.refreshCart();
  }

  placeOrder() {
    this.placingOrder.set(true);
    this.api.checkout().subscribe({
      next: () => {
        this.placingOrder.set(false);
        this.message.set('Order placed successfully');
        this.cartStore.refreshCart();
        setTimeout(() => void this.router.navigate(['/dashboard']), 1000);
      },
      error: () => {
        this.placingOrder.set(false);
        this.message.set('Unable to place order. Please try again.');
      }
    });
  }
}
