import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../core/cart/cart.store';
import { EcommerceApiService } from '../../core/api/ecommerce-api.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss'
})
export class CartPageComponent {
  readonly cartStore = inject(CartStore);
  private readonly api = inject(EcommerceApiService);

  readonly total = computed(() => this.cartStore.cart()?.total ?? 0);

  constructor() {
    this.cartStore.refreshCart();
  }

  changeQty(productId: string, quantity: number) {
    const nextQuantity = Math.max(quantity, 0);
    this.api.updateCartItem(productId, nextQuantity).subscribe({
      next: (cart) => this.cartStore.setCart(cart)
    });
  }

  remove(productId: string) {
    this.api.removeCartItem(productId).subscribe({
      next: (cart) => this.cartStore.setCart(cart)
    });
  }
}
