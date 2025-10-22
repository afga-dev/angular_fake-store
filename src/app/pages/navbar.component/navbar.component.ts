import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  protected readonly userService = inject(UserService);
  private readonly router = inject(Router);

  @Input() isSearchOpen = false;
  @Output() toggleSearch = new EventEmitter<void>();

  onToggleSearch(): void {
    this.toggleSearch.emit();
  }

  onSignOut(): void {
    this.userService.onSignOut();
    this.router.navigateByUrl('/signin');
  }
}
