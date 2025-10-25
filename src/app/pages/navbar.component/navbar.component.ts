import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  isSearchOpen = input(false);
  isCartOpen = input(false);
  searchToggled = output<void>();
  cartToggled = output<void>();

  onSignOut(): void {
    this.userService.onSignOut();
    this.router.navigateByUrl('/signin');
  }

  getIsSignedOn(): boolean {
    return this.userService.isSignedOn();
  }
}
