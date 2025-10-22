import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { SearchComponent } from './pages/search.component/search.component';
import { NavbarComponent } from './pages/navbar.component/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  protected readonly userService = inject(UserService);

  showSearch = false;

  ngOnInit(): void {
    this.userService.getUserFromLocalStorage();
  }

  // Toggles the search overlay and focuses the input when opened.
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  handleSearch(query: string): void {
    this.router.navigate(['/'], { queryParams: { q: query } });
  }

  closeSearch(): void {
    this.showSearch = false;
  }
}
