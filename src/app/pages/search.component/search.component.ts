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
  closeSearch = output<void>();
  search = output<string>();

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
    this.closeSearch.emit();
    this.search.emit(query);
  }
}
