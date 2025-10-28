import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchTerm = '';

  isSearchOpen = input(false);
  onCloseSearch = output<void>();
  onSearchQuery = output<string>();

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  ngOnChanges(): void {
    if (this.isSearchOpen()) this.focusInput();
  }

  private focusInput(): void {
    setTimeout(() => this.searchInput?.nativeElement.focus(), 300);
  }

  onSearch(): void {
    const query = this.searchTerm.toLowerCase().trim();
    if (!query) return;

    this.searchTerm = '';
    this.onCloseSearch.emit();
    this.onSearchQuery.emit(query);
  }
}
