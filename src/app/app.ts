import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './core/services/user.service';
import { SearchComponent } from './pages/search.component/search.component';
import { NavbarComponent } from './pages/navbar.component/navbar.component';
import { CartDrawerComponent } from './pages/cart-drawer.component/cart-drawer.component';
import { FooterComponent } from './pages/footer.component/footer.component';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SearchComponent,
    NavbarComponent,
    CartDrawerComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  private router = inject(Router);

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private cartService = inject(CartService);

  private _showSearch = signal<boolean>(false);
  readonly showSearch = this._showSearch.asReadonly();

  showCart = this.cartService.isOpen;

  loaded = computed(() => this.userService.isLoaded());
  pageLoaded = computed(() => this.authService.isPageLoaded());

  ngOnInit(): void {
    // Load user id from localStorage on app initialization
    this.userService.loadUserFromLocalStorage();
  }

  handleSearch(query: string): void {
    this.router.navigate(['/'], { queryParams: { q: query } });
  }

  searchToggled(): void {
    this._showSearch.update((v) => !v);
    this.closeCart();
  }

  closeSearch(): void {
    this._showSearch.set(false);
  }

  cartToggled(): void {
    this.cartService.setIsOpen(!this.showCart());
    this._showSearch.set(false);
  }

  closeCart(): void {
    this.cartService.setIsOpen(false);
  }

  closeChildren(): void {
    this.closeSearch();
    this.closeCart();
  }
}
