import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  protected readonly userService = inject(UserService);

  showSearch = false;
  searchTerm = '';

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.userService.getUserFromLocalStorage();
  }

  // Toggles the search overlay and focuses the input when opened.
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => this.searchInput?.nativeElement.focus(), 300);
    }
  }

  closeSearch(): void {
    this.showSearch = false;
  }

  // Triggered when user presses Enter on the search input.
  onSearch(): void {
    const query = this.searchTerm.toLowerCase().trim() ?? '';
    if (!query) return;

    this.searchTerm = '';
    this.closeSearch();

    this.router.navigate(['/'], { queryParams: { q: query } });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSearch();
  }

  onSignOut(): void {
    this.userService.onSignOut();
    this.router.navigateByUrl('/signin');
  }
}
