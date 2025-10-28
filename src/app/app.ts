import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { SearchComponent } from './pages/search.component/search.component';
import { NavbarComponent } from './pages/navbar.component/navbar.component';
import { CartDrawerComponent } from './pages/cart-drawer.component/cart-drawer.component';
import { CartService } from './services/cart.service';
import { FooterComponent } from './pages/footer.component/footer.component';

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
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private cartService = inject(CartService);

  showSearch = false;
  showCart = false;

  ngOnInit(): void {
    this.userService.loadUserFromLocalStorage();
  }

  readonly isOpen = effect(() => {
    this.showCart = this.cartService.isOpen();
  });

  getLoaded(): boolean {
    return this.userService.isLoaded();
  }

  getpageLoaded(): boolean {
    return this.userService.isPageLoaded();
  }

  handleSearch(query: string): void {
    this.router.navigate(['/'], { queryParams: { q: query } });
  }

  searchToggled(): void {
    this.showSearch = !this.showSearch;
    this.closeCart();
  }

  closeSearch(): void {
    this.showSearch = false;
  }

  cartToggled(): void {
    this.showCart = !this.showCart;
    this.cartService.setIsOpen(this.showCart);
    this.closeSearch();
  }

  closeCart(): void {
    this.showCart = false;
    this.cartService.setIsOpen(false);
  }

  closeChildren(): void {
    this.showSearch = false;
    this.showCart = false;
    this.cartService.setIsOpen(false);
  }
}
