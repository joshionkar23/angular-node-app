import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Cart } from '../../models/api.models';
import { EcommerceApiService } from '../api/ecommerce-api.service';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly api = inject(EcommerceApiService);

  private readonly cartSignal = signal<Cart | null>(null);
  private readonly loadingSignal = signal(false);

  readonly cart = computed(() => this.cartSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly itemsCount = computed(() =>
    this.cartSignal()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );

  refreshCart() {
    this.loadingSignal.set(true);
    this.api
      .getCart()
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (cart) => this.cartSignal.set(cart),
        error: () => this.cartSignal.set(null)
      });
  }

  setCart(cart: Cart) {
    this.cartSignal.set(cart);
  }

  clear() {
    this.cartSignal.set(null);
  }
}
