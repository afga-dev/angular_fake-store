import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LazyLoadingDirective } from '../../directives/lazyLoading.directive';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, LazyLoadingDirective],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  protected productService = inject(ProductService);

  products = signal<Product[] | null>(null);

  isLoaded = computed(() => !!this.products);

  ngOnInit(): void {
    this.loading();
  }

  protected async loading() {
    try {
      const products = await firstValueFrom(this.productService.getProducts());
      this.products.set(products);
    } catch (err) {
      // console.log(err);
    }
  }
}
