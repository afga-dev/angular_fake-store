import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
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
export class SearchComponent implements AfterViewInit {
  searchTerm = '';

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (this.isOpen) this.focusInput();
  }

  ngOnChanges(): void {
    if (this.isOpen) this.focusInput();
  }

  focusInput() {
    setTimeout(() => this.searchInput?.nativeElement.focus(), 300);
  }

  onClose() {
    this.isOpen = false;
    this.close.emit();
  }

  onSearch() {
    const query = this.searchTerm.toLowerCase().trim();
    if (!query) return;

    this.search.emit(query);
    this.searchTerm = '';
    this.onClose();
  }
}
