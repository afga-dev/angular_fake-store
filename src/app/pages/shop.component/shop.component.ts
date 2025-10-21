import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LazyLoadingDirective } from '../../directives/lazyLoading.directive';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, LazyLoadingDirective],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  protected activatedRoute = inject(ActivatedRoute);
  protected productService = inject(ProductService);

  products = signal<Product[]>([]);
  private queryParamMap = toSignal(this.activatedRoute.queryParamMap);

  isLoaded = computed(() => !!this.products);
  searchQuery = computed(() => this.queryParamMap()?.get('q') ?? '');
  filteredProducts = computed(() => {
    const query = this.searchQuery();
    return query
      ? this.products().filter((p) => p.title.toLowerCase().includes(query))
      : this.products();
  });

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
