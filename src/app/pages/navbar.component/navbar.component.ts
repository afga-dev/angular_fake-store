import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { scrollToElement, scrollToTop } from '../../utils/scroll-utils';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router = inject(Router);

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private cartService = inject(CartService);

  isSearchOpen = input(false);
  isCartOpen = input(false);
  onSearchToggled = output<void>();
  onCartToggled = output<void>();
  onScrollAction = output<void>();

  isAuthenticated = computed(() => this.userService.isAuthenticated());
  cart = computed(() => this.cartService.cart());

  toggleSearch(): void {
    this.onSearchToggled.emit();
  }

  toggleCart(): void {
    this.onCartToggled.emit();
  }

  getSearchIconClass(): string {
    return this.isSearchOpen() ? 'bi-x-lg' : 'bi-search';
  }

  getCartIconClass(): string {
    const cart = this.cart();
    const isCartOpen = this.isCartOpen();

    if (cart.length === 0) return isCartOpen ? 'bi-x-lg' : 'bi-cart';
    return isCartOpen ? 'bi-x-lg' : 'bi-cart-fill';
  }

  onSignOut(): void {
    this.authService.signOut();
  }

  // Scroll helpers
  scrollToHome(): void {
    if (this.router.url === '/') {
      this.onScrollAction.emit();
      scrollToTop();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  scrollToFooter(): void {
    this.onScrollAction.emit();
    scrollToElement('contact');
  }
}
