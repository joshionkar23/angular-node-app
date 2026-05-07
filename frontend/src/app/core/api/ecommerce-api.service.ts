import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, Cart, Order, Product } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class EcommerceApiService {
  private readonly http = inject(HttpClient);

  getProducts() {
    return this.http
      .get<ApiResponse<Product[]>>(`${environment.apiBaseUrl}/products`)
      .pipe(map((response) => response.data));
  }

  getCart() {
    return this.http
      .get<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart`)
      .pipe(map((response) => response.data));
  }

  addToCart(productId: string, quantity: number) {
    return this.http
      .post<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart/items`, { productId, quantity })
      .pipe(map((response) => response.data));
  }

  updateCartItem(productId: string, quantity: number) {
    return this.http
      .put<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart/items/${productId}`, { quantity })
      .pipe(map((response) => response.data));
  }

  removeCartItem(productId: string) {
    return this.http
      .delete<ApiResponse<Cart>>(`${environment.apiBaseUrl}/cart/items/${productId}`)
      .pipe(map((response) => response.data));
  }

  checkout() {
    return this.http
      .post<ApiResponse<Order>>(`${environment.apiBaseUrl}/cart/checkout`, {})
      .pipe(map((response) => response.data));
  }
}
