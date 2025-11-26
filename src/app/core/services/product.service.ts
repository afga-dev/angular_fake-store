import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';
import { API_URL } from './api.tokens';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = inject(API_URL);
  private httpClient = inject(HttpClient);
  private activatedRoute = inject(ActivatedRoute);

  private _products = signal<Product[]>([]);

  private _queryParamMap = toSignal(this.activatedRoute.queryParamMap);
  private queryParamSearch = computed(
    () => this._queryParamMap()?.get('q') ?? ''
  );

  // Filter products based on the search query
  readonly filteredProducts = computed(() => {
    const query = this.queryParamSearch();
    return query
      ? this._products().filter((p) => p.title.toLowerCase().includes(query))
      : this._products();
  });

  // Fetch products from API
  fetchProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/products`);
  }

  setProducts(products: Product[]) {
    this._products.set(products);
  }
}
