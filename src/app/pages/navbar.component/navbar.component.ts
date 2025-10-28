import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { scrollToElement, scrollToTop } from '../../utils/scroll-utils';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router = inject(Router);
  private userService = inject(UserService);

  isSearchOpen = input(false);
  isCartOpen = input(false);
  onSearchToggled = output<void>();
  onCartToggled = output<void>();
  onClick = output<void>();

  onSignOut(): void {
    this.userService.signOut();
  }

  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  scrollToHome(): void {
    if (this.router.url === '/') {
      this.onClick.emit();
      scrollToTop();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  scrollToFooter(): void {
    this.onClick.emit();
    scrollToElement('contact');
  }
}
