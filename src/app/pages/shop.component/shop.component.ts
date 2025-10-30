import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { catchError, delay, firstValueFrom, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LazyLoadingDirective } from '../../directives/lazyLoading.directive';
import { CartService } from '../../services/cart.service';
import { SkeletonComponent } from '../../shared/skeleton.component/skeleton.component';
import { AuthService } from '../../services/auth.service';

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
