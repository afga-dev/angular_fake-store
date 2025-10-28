import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LazyLoadingDirective } from '../../directives/lazyLoading.directive';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';
import { SkeletonComponent } from '../../shared/skeleton.component/skeleton.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, LazyLoadingDirective, SkeletonComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  private products = signal<Product[]>([]);

  readonly loading = signal(true);

  private queryParamMap = toSignal(this.activatedRoute.queryParamMap);
  private searchQuery = computed(() => this.queryParamMap()?.get('q') ?? '');

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery();
    return query
      ? this.products().filter((p) => p.title.toLowerCase().includes(query))
      : this.products();
  });

  async ngOnInit() {
    try {
      const products = await firstValueFrom(this.productService.getProducts());
      this.products.set(products);
    } catch (err) {
      // console.log(err);
    } finally {
      setTimeout(() => this.loading.set(false), 200);
    }
  }

  addCart(product: Product): void {
    const newProduct = this.cartService.createCart(product);
    this.cartService.addProduct(newProduct);
    this.cartService.setIsOpen(true);
  }
}
