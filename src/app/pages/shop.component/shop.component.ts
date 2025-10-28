import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LazyLoadingDirective } from '../../directives/lazyLoading.directive';
import { CartService } from '../../services/cart.service';
import { SkeletonComponent } from '../../shared/skeleton.component/skeleton.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, LazyLoadingDirective, SkeletonComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();

  async ngOnInit() {
    try {
      const products = await firstValueFrom(
        this.productService.fetchProducts()
      );
      this.productService.setProducts(products);
    } catch (err) {
      // console.log(err);
    } finally {
      setTimeout(() => this._loading.set(false), 200);
      this.userService.setPageLoaded(true);
    }
  }

  addToCart(product: Product): void {
    const newProduct = this.cartService.createCart(product);
    this.cartService.addProduct(newProduct);
    this.cartService.setIsOpen(true);
  }

  getFilteredProducts(): Product[] {
    return this.productService.filteredProducts();
  }
}
