import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../core/models/product.interface';
import { ProductService } from '../../core/services/product.service';
import { catchError, delay, firstValueFrom, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LazyLoadingDirective } from '../../shared/directives/lazy-loading.directive';
import { CartService } from '../../core/services/cart.service';
import { SkeletonComponent } from '../../shared/components/shop-skeleton.component/shop-skeleton.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, LazyLoadingDirective, SkeletonComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private _loading = signal<boolean>(true);
  readonly loading = this._loading.asReadonly();

  filteredProducts = computed(() => this.productService.filteredProducts());

  async ngOnInit() {
    try {
      await firstValueFrom(
        this.productService.fetchProducts().pipe(
          tap((p) => this.productService.setProducts(p)),
          delay(200),
          catchError(() => {
            this._error.set('Failed to load products');
            return of([]);
          })
        )
      );
    } finally {
      this._loading.set(false);
      this.authService.setPageLoaded(true);
    }
  }

  addToCart(product: Product): void {
    const newProduct = this.cartService.createCart(product);
    this.cartService.addProduct(newProduct);
    this.cartService.setIsOpen(true);
  }
}
