import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private ngZone = inject(NgZone);

  searchTerm = '';

  isSearchOpen = input(false);
  onCloseSearch = output<void>();
  onSearchQuery = output<string>();

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  readonly focusOnOpen = effect(() => {
    if (this.isSearchOpen()) this.focusInput();
  });

  private focusInput(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.searchInput?.nativeElement.focus();
      });
    });
  }

  onClose(): void {
    this.onCloseSearch.emit();
  }

  onSearch(): void {
    const query = this.searchTerm.toLowerCase().trim();
    if (!query) return;

    this.searchTerm = '';
    this.onCloseSearch.emit();
    this.onSearchQuery.emit(query);
  }
}
